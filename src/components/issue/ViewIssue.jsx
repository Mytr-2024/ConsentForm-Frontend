import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi, patchApi, postApi } from "../../helpers/requestHelpers";
import Loader from "../../components/loader/Loader";
import AreaTop from "../dashboard/areaTop/AreaTop";
import { Toast } from "../alert/Alert";

export default function ViewIssue() {
  const { id } = useParams();
  const [issueData, setIssueData] = useState(null);
  const [loader, setLoader] = useState(true);

  const getIssueData = async () => {
    setLoader(true);
    try {
      let res = await getApi("get", `/api/issues/issue/${id}`);
      setIssueData(res?.data?.issue || {});
    } catch (error) {
      console.error("Error fetching issue data:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (id) {
      getIssueData();
    }
  }, [id]);



  const handleResolve=async()=>{
    setLoader(true)
   try {
    const data={
        issueId: id,
    }
    let res = await postApi("post", `/api/issues/updateIssueStatus`,data);
    setIssueData(res?.data?.issue || {});
    Toast.fire({
        icon: "success",
        title: "Issue Status Updated",
      });
      setLoader(false)

   } catch (error) {
    setLoader(false)

    Toast.fire({
        icon: "error",
        title: "Something Went's Wrong ",
      });
   }
  }

  return (
    <>
      <h2 className="text-center fw-bold my-3">
        <span style={{ color: "#7C46BE" }}>Issue</span>
      </h2>
      <div className="content-area mt-3">
        {loader ? (
          <div className="d-flex w-100 justify-content-center align-items-center">
            <Loader />
          </div>
        ) : (
          <div className="container consentForm px-0 py-5 d-flex flex-wrap justify-content-center align-items-center">
            <div className="col-md-11 borderC mx-3 d-flex flex-column mb-5 justify-content-center">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <span className="form-label">{issueData?.description}</span>
            </div>
            <div className="col-md-11 borderC mx-5 d-flex flex-column mb-5 justify-content-center">
              <label htmlFor="raisedBy" className="form-label">
                Raised By
              </label>
              <span className="form-label">{issueData?.raisedBy}</span>
            </div>
            <div className="col-md-11 borderC mx-5 d-flex flex-column mb-5 justify-content-center">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <span className="form-label">{issueData?.status}</span>
            </div>
            <div className="col-md-11 borderC mx-5 d-flex flex-column mb-5 justify-content-center">
              <label htmlFor="raiseDate" className="form-label">
                Raise Date
              </label>
              <span className="form-label">{new Date(issueData?.raiseDate).toLocaleString()}</span>
            </div>
            <div className="col-md-11 borderC mx-5 d-flex flex-column mb-5 justify-content-center">
              <label htmlFor="updatedAt" className="form-label">
                Updated At
              </label>
              <span className="form-label">{new Date(issueData?.updatedAt).toLocaleString()}</span>
            </div>

          {issueData?.imageUrl &&  <div className="col-md-12 mb-5 d-flex justify-content-around mt-3">
                  <div className="position-relative" style={{ width: "200px", height: "150px" }}>
                    <img 
                      className='px-2 mx-2 img-fluid' 
                      style={{ width: "100%", height: "150px" }} 
                      src={issueData?.imageUrl} 
                      alt={`Uploaded file`} 
                    />
                  </div>
                </div>}


           {issueData?.status==='unresolved' && <div className="col-md-11  mx-5 d-flex flex-column mb-5 justify-content-center">
                <button onClick={handleResolve} className="btn btn-success" >Mark as Resolved</button>
             </div>}
           {issueData?.status==='resolved' &&  <div className="col-md-11  mx-5 d-flex flex-column mb-5 justify-content-center">
                <button onClick={handleResolve} className="btn btn-danger" >Mark as Unresolved</button>
             </div>}
          </div>
        )}
      </div>
    </>
  );
}
