
import mytrLogo from "../../assets/images/mytr.png"
import man from "../../assets/icons/man.png"
import './navbar.css'
import { useContext } from "react";
import { SidebarContext } from "../../context/SidebarContext";

export default function Navbar() {
    const { openSidebar } = useContext(SidebarContext);

  return (
    <nav style={{zIndex:"99999", background:"white"}} className="navbar p-0 navbar-expand-lg position-sticky top-0 ">
  <div className="container-fluid">
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
      <div className="d-flex" role="search">
      <div className="dropdown  ">
  <button className="btn shadow-none border-0 d-flex flex-column p-0  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
   <img style={{height:"25px"}} src={man} alt="Admin"/>
   <div className="d-flex justify-content-between align-items-center">
   <h6 style={{fontSize:"15px"}} className="mb-0 me-2" >Me</h6>
   <i style={{fontSize:"15px"}} className="fa-solid mb-1 fa-sort-down"></i>
   </div>
  </button>
  {/* <ul className="dropdown-menu">
    <li><a className="dropdown-item" href="#">Action</a></li>
    <li><a className="dropdown-item" href="#">Another action</a></li>
    <li><a className="dropdown-item" href="#">Something else here</a></li>
  </ul> */}
</div>
        </div>
    </div>
  </div>
</nav>
  )
}
