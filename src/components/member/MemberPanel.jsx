import { useState, useContext } from "react";
import TripContext from "../../context/TripContext";
import UserContext from "../../context/UserContext";
import MemberCard from "./MemberCard";

function MemberPanel({ isTripCreator, members }) {
  // const { members } = useContext(TripContext);
  const { friends } = useContext(UserContext);
  const [isAdding, setIsAdding] = useState(false);
  const eligibleFriends = friends.filter(
    (friend) => !members.some((member) => member.userId === friend.userId)
  );

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Members</h2>
        {isTripCreator && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            {isAdding ? "Back to Members" : "Add Friends"}
          </button>
        )}
      </div>

      <div className="mt-4">
        {/* Show list of current members */}
        {!isAdding &&
          (members.length > 0 ? (
            members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isTripCreator={isTripCreator}
              />
            ))
          ) : (
            <p className="text-gray-500">No members yet.</p>
          ))}

        {/* Show list of eligible friends to add */}
        {isAdding &&
          (eligibleFriends.length > 0 ? (
            eligibleFriends.map((friend) => (
              <MemberCard key={friend.friendId} member={friend} isEditing />
            ))
          ) : (
            <p className="text-gray-500">No eligible friends to add.</p>
          ))}
      </div>
    </div>
  );
}

export default MemberPanel;
