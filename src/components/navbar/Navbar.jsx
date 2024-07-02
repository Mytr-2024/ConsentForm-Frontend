
import mytrLogo from "../../assets/images/mytr.png"
import man from "../../assets/icons/man.png"
import './navbar.css'
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../context/SidebarContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const { openSidebar } = useContext(SidebarContext);
const [show, setShow] = useState(false)

const box = useRef(null)

useEffect(() => {
  function handleClickOutside(event) {
    if (box.current && !box.current.contains(event.target)) {
      setShow(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [box]);


const navigate=useNavigate()

const handleLogout=()=>{
  localStorage.clear();
  navigate('/')

}

  return (
    <nav style={{zIndex:"1000", background:"white"}} className="navbar p-0 navbar-expand-lg position-sticky top-0 ">
  <div className="container-fluid position-relative">
  <div className="d-flex align-items-center">
  <img src={mytrLogo} alt="" />
  <button
          className="sidebar-open-btn d-block d-md-block d-lg-block d-xl-none"
          type="button"
          onClick={openSidebar}
        >
          <i style={{color:"#603394"}} className="fa-solid fa-bars fs-2"></i>
        </button>
  </div>
  <button className="btn  d-lg-none shadow-none border-0 d-flex flex-column p-0  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
   <img style={{height:"25px"}} src={man} alt="Admin"/>
   <div className="d-flex justify-content-between align-items-center">
   <h6 style={{fontSize:"15px"}} className="mb-0 me-2" >Me</h6>
   <i style={{fontSize:"15px"}} className="fa-solid mb-1 fa-sort-down"></i>
   </div>
  </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0"> 
      </ul>
      <div ref={box} onClick={()=>setShow(!show)}  className="d-flex" role="search">
      <div className="dropdown  ">
  <button className="btn position-relative shadow-none border-0 d-flex flex-column p-0  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
   <img style={{height:"25px"}} src={man} alt="Admin"/>
   <div className="d-flex justify-content-between align-items-center">
   <h6 style={{fontSize:"15px"}} className="mb-0 me-2" >Me</h6>
   <i style={{fontSize:"15px"}} className="fa-solid mb-1 fa-sort-down"></i>
   </div>
  
  </button>

</div>

        </div>
        
    </div>

    {show && <ul
    ref={box} 
  className="position-absolute p-0 end-0"
  style={{
    top: "100%",
    background: "white",
    boxShadow: "7px 0px 14px -3px rgba(0, 0, 0, 0.1)",
    border:"1px solid grey",
    borderRadius:"4px"
  }}
>
  <li className="py-1 pe-5">
    <Link to={`/editAdmin/${JSON.parse(localStorage.getItem('user'))?.user?.email}`} className="dropdown-item ps-2 " >Profile</Link>
  </li>
  <li onClick={handleLogout} style={{ borderTop: "1px solid grey" }} className="py-1 pe-5 ">
    <Link className="dropdown-item ps-2" >Logout</Link>
  </li>
</ul>}

  </div>
  
</nav>
  )
}
