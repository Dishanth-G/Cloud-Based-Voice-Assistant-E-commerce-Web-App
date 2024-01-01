import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route,Routes,Router } from "react-router-dom";

const ProtectedRoute = ({ isAdmin,component:RouteComponent,...rest} ) => {


  const {  isAuthenticated,user } = useSelector((state) => state.user);

  
if(isAuthenticated=== false){

    return <Navigate to="/login" />

}

if(isAdmin===true && user.role!== "admin"){
  return <Navigate to="/login" />

}

return <RouteComponent/>


};

export default ProtectedRoute;