import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("userData") || "null");

  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  
  if (adminOnly && user.role !== "Admin") {
    return <Navigate to="/home" replace />;
  }
  

  return children;
};

export default PrivateRoute;
