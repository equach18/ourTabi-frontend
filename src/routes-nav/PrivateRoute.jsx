import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/common/Spinner";

/** Protects routes that require authentication */
function PrivateRoute({ currentUser, isLoading }) {
  if (isLoading) return <Spinner />;

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;