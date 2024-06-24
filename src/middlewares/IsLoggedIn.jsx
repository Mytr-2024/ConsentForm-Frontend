import React from "react";
import { Navigate, Route } from "react-router-dom";

export const IsLoggedIn = ({ children }) => {
  let authUserData = JSON.parse(localStorage.getItem('user'))?.user;

  if (authUserData) {
    return <Navigate to={`/stats/${authUserData?.email}`} />;
  } 

  // Render child components if the user is authenticated
  return <>{children}</>;
};

