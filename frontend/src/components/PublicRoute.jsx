// If already logged in → go to products
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/products" />;
  }

  return children;
};

export default PublicRoute;