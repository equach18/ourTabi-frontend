import { useContext } from "react";
import TripContext from "../../context/TripContext";
import defaultProfilePic from "../../assets/profilePic.jpg";

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
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={member.profilePic || defaultProfilePic}
          alt={`${member.username}'s avatar`}
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div className="text-sm">
          <p className="font-semibold">
            {member.firstName} {member.lastName}
            {isOwner && " (owner)"}
            {!isOwner && member.role && ` (${member.role})`}
          </p>
          <p className="text-gray-500">@{member.username}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing && (
          <button
            onClick={() => handleAddMember(member)}
            className="text-sm bg-green-500 hover:bg-green-600 text-white px-2 rounded"
          >
            Add
          </button>
        )}
        {isTripCreator && !isOwner && (
          <button
            onClick={() => handleRemoveMember(member)}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 rounded"
          >
            X
          </button>
        )}
      </div>
    </div>
  );
}

export default MemberCard;
