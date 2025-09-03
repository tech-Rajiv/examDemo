import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role }) {
  const localToken = localStorage.getItem("token");
  const localRole = localStorage.getItem("role");
  if (!localToken || localRole !== role) {
     return <Navigate to={`/login`} replace />;
  }
  return children;
}
export default PrivateRoute;
