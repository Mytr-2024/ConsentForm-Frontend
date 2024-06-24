import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import { getApi } from "../../../helpers/requestHelpers";

const AreaTableAction = ({ dataItem }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);






  return (
    <>
      <div className="d-flex justify-content-center" >
        <Link to={`/viewConsent/${dataItem?._id}`}>
          <button className="btn btn-primary mx-2">
            <i className="fa-solid fa-eye"></i>
          </button>
        </Link>
        <Link to={`/editConsent/${dataItem?._id}`}>
          <button className="btn btn-info mx-2">
            <i className="text-white fa-solid fa-pen-to-square"></i>
          </button>
        </Link>
        {showDropdown && (
          <div ref={dropdownRef} className="dropdown-menu">
            <Link to={`/deleteConsent/${dataItem?._id}`} className="dropdown-item">Delete</Link>
            <Link to={`/moreActions/${dataItem?._id}`} className="dropdown-item">More</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default AreaTableAction;
