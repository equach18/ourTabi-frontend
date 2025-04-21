import { Navigate, Outlet } from "react-router-dom";

/** Protects routes that require authentication */
function PrivateRoute({ currentUser, isLoading }) {

  if (isLoading) return <Spinner />;

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
