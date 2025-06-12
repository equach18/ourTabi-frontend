import { NavLink } from "react-router-dom";
import { useContext } from "react";
import TripSearchBar from "../components/trip/TripSearchBar";
import UserContext from "../context/UserContext";

function NavBar() {
  const { currentUser, logout } = useContext(UserContext);

  return (
    <nav className="bg-stone-300 shadow px-6 py-4 flex items-center justify-between relative">
      <NavLink
        to={currentUser ? "/dashboard" : "/"}
        className="text-2xl font-bold text-orange-600 font-heading z-10 hover:text-orange-500 transition"
      >
        OurTabi
      </NavLink>

      {currentUser && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <TripSearchBar />
        </div>
      )}

      <div className="flex items-center space-x-4 z-10">
        {currentUser ? (
          <button
            onClick={logout}
            className="text-slate-600 hover:text-orange-500 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-slate-600 hover:text-orange-500 transition"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="text-slate-600 hover:text-orange-500 transition"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
