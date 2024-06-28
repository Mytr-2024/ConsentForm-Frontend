import React, { useEffect, useState } from 'react';
import { getApi, postApi } from '../../helpers/requestHelpers';
import Loader from '../../components/loader/Loader';
import { Toast } from "../../components/alert/Alert";
import { useNavigate, useParams } from 'react-router-dom';
import { AreaTop } from '../../components';

export default function EditAdmin() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');

  const [loading, setLoading] = useState(false)
  const navigate=useNavigate();
  const {email}=useParams()


const setAllAdminData=async()=>{
  let res=   await getApi("get",`api/admin/?email=${email}`)
setAdminName(res?.data?.name)
setAdminEmail(res?.data?.email)
setIsSuperAdmin(res?.data?.isSuperAdmin)
}

  useEffect(() => {
    setAllAdminData()
  }, [])



  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    const data={
    email:adminEmail,
    // password:adminPassword,
    isSuperAdmin:isSuperAdmin,
    loggedInUserId:JSON.parse(localStorage.getItem('user'))?.user?._id
    }

    try {
    let res= await postApi("post","api/user/edit",data)

   
    if(res?.data?.status===true){
      Toast.fire({
        icon: "success",
        title: "Admin Updated"
    });
    navigate('/viewAdmin')
    }
    else{
      setLoading(false)
      Toast.fire({
        icon: "error",
        title: `${res?.response?.data?.message}`
    });
    
    }

    } catch (error) {
      console.log(error)
      setLoading(false)
      Toast.fire({
        icon: "error",
        title: `Something went's wrong`
    });

    }

  };

  return (
    <>



   {!loading && 
    <div className="content-area">
      <AreaTop title='Edit Admin'/>
    <div style={{ height: "100%" }} className="container consentForm p-5">
      <form className="row" onSubmit={handleSubmit}>
      <div className="col-md-3 my-2">
          <label htmlFor="adminName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="adminName"
            name="adminName"
            placeholder="Enter Admin Name"
            required
            value={adminName}
            onChange={(e) => {
              setAdminName(e.target.value);
            }}
          />
        </div>
        <div className="col-md-4 my-2">
          <label htmlFor="adminEmail" className="form-label">
            Email Id
          </label>
          <input
            type="text"
            className="form-control"
            id="adminEmail"
            name="adminEmail"
            placeholder="Enter Admin Email"
            required
            value={adminEmail}
            onChange={(e) => {
              setAdminEmail(e.target.value);
            }}
          />
        </div>
        {/* <div className="col-md-3 my-2">
          <label htmlFor="adminPassword" className="form-label">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            id="adminPassword"
            name="adminPassword"
            placeholder="Enter Admin Password"
            required
            value={adminPassword}
            onChange={ (e) => {
              setAdminPassword(e.target.value);
            }}
          />
        </div> */}
        <div className="col-md-4 my-2">
          <label htmlFor="isSuperAdmin" className="form-label">
            Is SuperAdmin
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={isSuperAdmin}
              onChange={(e) => {
                setIsSuperAdmin(e.target.checked);
              }}
            />
          </div>
        </div>
        <div className="col-md-12 my-2">
          <button type="submit" style={{ height: "100%" }} className="w-100 btn btn-success">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
 

  }
   {loading &&
    <div className="d-flex w-100 justify-content-center align-items-center">
        <Loader/>
    </div>
 }
  </>

  )
}
