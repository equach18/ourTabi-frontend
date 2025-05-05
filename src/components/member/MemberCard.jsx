import { useContext } from "react";
import TripContext from "../../context/TripContext";

function MemberCard({ member, isEditing = false, isTripCreator = false }) {
  const { addMember, removeMember } = useContext(TripContext);
  const isOwner = member.role === "owner";

  function handleAddMember() {
    addMember(member);
  }

  function handleRemoveMember() {
    removeMember(member);
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-3">
      <div className="flex items-center gap-3">
        <img
          src={member.profilePic || "/default-avatar.png"}
          alt={`${member.username}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">
            {member.firstName} {member.lastName} ({member.role})
          </p>
          <p className="text-sm text-gray-500">@{member.username}</p>
        </div>
      </div>
      {isEditing && (
        <button
          onClick={handleAddMember}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
        >
          Add to Trip
        </button>
      )}
      {isTripCreator && !isOwner && (
        <button
          onClick={handleRemoveMember}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm"
        >
          Remove
        </button>
      )}
      <div className="flex gap-2"></div>
    </div>
  );
}

export default MemberCard;
