import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // Check if admin is logged in
  const adminInfo = localStorage.getItem("adminInfo");
  
  if (!adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const parsedAdminInfo = JSON.parse(adminInfo);
    
    // Check if token exists and is valid format
    if (!parsedAdminInfo.token || !parsedAdminInfo.admin) {
      localStorage.removeItem("adminInfo");
      return <Navigate to="/admin/login" replace />;
    }

    // Check if token is expired (basic check)
    const tokenParts = parsedAdminInfo.token.split('.');
    if (tokenParts.length !== 3) {
      localStorage.removeItem("adminInfo");
      return <Navigate to="/admin/login" replace />;
    }

    // Token appears valid, render the protected component
    return <Outlet />;
    
  } catch (error) {
    // If there's any error parsing the admin info, clear it and redirect
    console.error("Error parsing admin info:", error);
    localStorage.removeItem("adminInfo");
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRoute;