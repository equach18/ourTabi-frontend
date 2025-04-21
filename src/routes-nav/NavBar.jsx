import { Link, NavLink } from "react-router-dom";
import useUser from "../hooks/useUser";

function NavBar() {
  const { currentUser, logout } = useUser();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <NavLink
        to={currentUser ? "/dashboard" : "/"}
        className="text-2xl font-bold text-blue-500"
      >
        OurTabi
      </NavLink>

      {/* Navigation Links */}
      <div className="space-x-4">
        {currentUser ? (
          <>
            <NavLink
              to="/dashboard"
              className="text-gray-600 hover:text-blue-500"
            >
              Dashboard
            </NavLink>
            <NavLink to="/trips" className="text-gray-600 hover:text-blue-500">
              My Trips
            </NavLink>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="text-gray-600 hover:text-blue-500">
              Login
            </NavLink>
            <NavLink to="/signup" className="text-gray-600 hover:text-blue-500">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
