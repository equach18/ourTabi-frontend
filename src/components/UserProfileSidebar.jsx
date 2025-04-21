import { useContext } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function UserProfileSidebar() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!currentUser) return null; // Ensure user data exists

  return (
    <div className="w-1/4 bg-white p-6 shadow-md rounded-lg">
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <img
          src={currentUser.profileImage || "/default-profile.png"} // Use default if none
          alt="User Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <h2 className="mt-4 text-xl font-bold">{currentUser.username}</h2>
        <p className="text-gray-500">{currentUser.email}</p>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={() => navigate("/profile/edit")}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default UserProfileSidebar;
