import { useEffect, useState } from "react";
import { getApi, deleteApi, patchApi, postApi } from "../../helpers/requestHelpers";
import Swal from "sweetalert2";
import Loader from "../../components/loader/Loader";
import DataTable from "react-data-table-component";
import { Toast } from "../../components/alert/Alert";
import { AreaTop } from "../../components";
import { Link, useNavigate } from "react-router-dom";

export default function IssueList() {
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalData, setOriginalData] = useState([]);

  const getAllIssuesList = async () => {
    setLoader(true);
    let res = await getApi("get", "api/issues/getIssues");
    setOriginalData(res?.data?.issues || []);
    setFilteredData(res?.data?.issues || []);
    setLoader(false);
  };

  useEffect(() => {
    getAllIssuesList();
  }, []);

  const handleDeleteIssue = async (id) => {
    await Swal.fire({
      title: "Are you sure want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await deleteApi("delete", `/api/issues/deleteIssue?issueId=${id}`);
          if (res?.data?.status === true) {
            setFilteredData((prevData) => prevData.filter((item) => item?._id !== id));
            setOriginalData((prevData) => prevData.filter((item) => item?._id !== id));
            Toast.fire({
              icon: "success",
              title: "Issue Deleted",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: `${res?.response?.data?.message}`,
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoader(false);
        }
      }
    });
  };

  const handleStatusToggle = async (id, status) => {
    const newStatus = status === "resolved" ? "unresolved" : "resolved";
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );
    setOriginalData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );
    Toast.fire({
      icon: "success",
      title: "Status Updated",
    });
    // Call API to update status
    try {
      const data={
        issueId:id,
       status: newStatus 
      }
      let res = await postApi("post", `/api/issues/updateIssueStatus`, data);
      // if (res?.data?.status === true) {
        
      // } else {
      //   Toast.fire({
      //     icon: "error",
      //     title: `${res?.response?.data?.message}`,
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const generateActionButtons = (row) => (
    <div>
      <Link to={`/viewIssue/${row._id}`}>
        <button className="btn btn-primary mx-2">
          <i className="fa-solid fa-eye"></i>
        </button>
      </Link>
      <button className="btn btn-danger mx-2" onClick={() => handleDeleteIssue(row?._id)}>
        <i className="fa-solid fa-trash"></i>
      </button>
      {/* <Link to={`/editIssue/${row._id}`}>
        <button className="btn btn-info mx-2">
          <i className="text-white fa-solid fa-pen-to-square"></i>
        </button>
      </Link> */}
    </div>
  );

  const columns = [
    {
      name: 'Sno',
      selector: (row) => row.sno,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.description.length > 10 ? `${row.description.slice(0, 10)}...` : row.description,
      sortable: true,
    },
    {
      name: 'Raised By',
      selector: (row) => row.raisedBy,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`flexSwitchCheckChecked-${row._id}`}
            checked={row.status === "resolved"}
            onChange={() => handleStatusToggle(row._id, row.status)}
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Raise Date',
      selector: (row) => new Date(row.raiseDate).toLocaleString(),
      sortable: true,
    },
  
    {
      name: 'Actions',
      selector: (row) => row.actions,
      sortable: false,
    },
  ];

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = originalData.filter((item) =>
      item.description?.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const modifiedData = filteredData?.map((row, index) => ({
    ...row,
    sno: index + 1,
    actions: generateActionButtons(row),
  }));

  return (
    <>
      {loader && (
        <div style={{minHeight:"100vh"}} className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {!loader && (
        <div className="content-area mt-2">
          <h1 className="fw-bold text-center" > <span style={{color:"#7C46BE"}} > Issue</span> List'</h1>
          <div style={{ minHeight: "90vh" }} className="container consentForm p-5">
            <div className="d-flex align-items-center mb-3 pb-3 justify-content-end">
              <div className="search-container">
                <form className="d-flex flex-row-reverse" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search by description"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </form>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={modifiedData}
              pagination
              responsive
            />
          </div>
        </div>
      )}
    </>
  );
}
