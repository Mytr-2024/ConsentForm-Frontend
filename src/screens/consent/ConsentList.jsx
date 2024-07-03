import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { deleteApi, getApi } from '../../helpers/requestHelpers';
import Swal from 'sweetalert2';
import Loader from '../../components/loader/Loader';
import { AreaTop } from '../../components';

export default function ConsentList() {
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [type, setType] = useState('all');

  const getAllConsentList = async () => {
    setLoader(true);
    try {
      let res = await getApi('get', 'api/consent/getAllConsent');
      const consentData = res?.data?.consentData || [];
      setOriginalData(consentData);
      filterConsentData(consentData, type, searchTerm);
    } catch (error) {
      console.error('Failed to fetch consent list:', error);
    }
    setLoader(false);
  };

  useEffect(() => {
    getAllConsentList();
  }, []);

  const handleDeleteConsent = async (_id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        let res = await deleteApi('delete', `api/consent/consentById?consentId=${_id}`);
        if (res?.data?.status === true) {
          const updatedOriginalData = originalData.filter((item) => item._id !== _id);
          setOriginalData(updatedOriginalData);
          filterConsentData(updatedOriginalData, type, searchTerm);
        }
      } catch (error) {
        console.error('Failed to delete consent:', error);
      }
    }
  };

  const generateActionButtons = (row) => (
    <div>
      <Link to={`/viewConsent/${row._id}`}>
        <button className="btn btn-primary mx-2">
          <i className="fa-solid fa-eye"></i>
        </button>
      </Link>
      <button className="btn btn-danger mx-2" onClick={() => handleDeleteConsent(row?._id)}>
        <i className="fa-solid fa-trash"></i>
      </button>
      <Link to={`/editConsent/${row._id}`}>
        <button className="btn btn-info mx-2">
          <i className="text-white fa-solid fa-pen-to-square"></i>
        </button>
      </Link>
    </div>
  );

  const columns = [
    {
      name: 'Sno',
      selector: (row) => row.sno,
      sortable: true,
    },
    {
      name: 'Patient Name',
      selector: (row) => row.patientName,
      sortable: true,
    },
    {
      name: 'Case Type',
      selector: (row) => row.caseType,
      sortable: true,
    },
    {
      name: 'Mobile Number',
      selector: (row) => row.mobileNo,
      sortable: true,
    },
    {
      name: 'Created By',
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: 'Actions',
      selector: (row) => row.actions,
      sortable: true,
      width: 'auto',
    },
  ];

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterConsentData(originalData, type, term);
  };

  const filterConsentData = (data, filterType, search) => {
    let updatedData = data;
    if (filterType === 'completed') {
      updatedData = data.filter(item => item.surgeonSignatureUrl);
    } else if (filterType === 'uncompleted') {
      updatedData = data.filter(item => !item.surgeonSignatureUrl);
    }
    if (search) {
      const lowercasedFilter = search.toLowerCase();
      updatedData = updatedData.filter((item) => {
        return Object.keys(item).some((key) =>
          item[key]?.toString().toLowerCase().includes(lowercasedFilter)
        );
      });
    }
    setFilteredData(updatedData);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (filterType) => {
    setType(filterType);
    filterConsentData(originalData, filterType, searchTerm);
  };

  const modifiedData = filteredData.map((row, index) => ({
    ...row,
    mobileNo: row?.mobileNo,
    createdBy: row?.createdBy ? row?.createdBy : 'Unknown',
    sno: index + 1,
    actions: generateActionButtons(row),
  }));

  return (
    <>
      {loader && (
        <div className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {!loader && (
        <div className="content-area mt-3">
          <div style={{ minHeight: '90vh' }} className="container consentForm p-5">
            <div className="d-flex align-items-center mb-3 pb-3 justify-content-end">
              <div className="search-container">
                <form onSubmit={handleSearchSubmit} className="d-flex flex-row-reverse" role="search">
                  <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {type === 'all' ? 'All Consent Form' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" onClick={() => handleFilterChange('all')}>All Consent Form</Link></li>
                      <li><Link className="dropdown-item" onClick={() => handleFilterChange('completed')}>Completed</Link></li>
                      <li><Link className="dropdown-item" onClick={() => handleFilterChange('uncompleted')}>Uncompleted</Link></li>
                    </ul>
                  </div>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </form>
              </div>
            </div>
            <DataTable columns={columns} data={modifiedData} pagination responsive />
          </div>
        </div>
      )}
    </>
  );
}
