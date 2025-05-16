import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../../assets/profilePic.jpg";


function UserProfileSidebar() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  if (!currentUser) return null;

  return (
    <div className="w-full max-w-[260px] bg-white p-4 rounded-xl shadow flex flex-col items-center text-center gap-3">
      {/* Profile Picture */}
      <img
        src={currentUser.profilePic || defaultProfilePic}
        alt="User Profile"
        className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
      />

      {/* User Info */}
      <h2 className="text-lg font-semibold text-zinc-800">
        {currentUser.username}
      </h2>
      <p className="text-sm text-gray-500">{currentUser.email}</p>
      {currentUser.bio && (
        <p className="text-sm text-zinc-600 italic">{currentUser.bio}</p>
      )}

      {/* Edit Button */}
      <button
        onClick={() => navigate("/profile/edit")}
        className="mt-2 w-full bg-gray-400 text-white py-1 rounded-lg hover:bg-gray-500 transition"
      >
        Edit Profile
      </button>
    </div>
  );
}

export default UserProfileSidebar;
