import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import MemberCard from "./MemberCard";

function MemberPanel({ isTripCreator, members }) {
  const { friends } = useContext(UserContext);
  const [isAdding, setIsAdding] = useState(false);
  const eligibleFriends = friends.filter(
    (friend) => !members.some((member) => member.userId === friend.userId)
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold">Members</h2>
        {isTripCreator && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
            aria-label={isAdding ? "Back to members list" : "Show eligible friends"}
          >
            {isAdding ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {!isAdding ? (
          members.length > 0 ? (
            members.map((member) => (
              <MemberCard
                key={member.userId}
                member={member}
                isTripCreator={isTripCreator}
              />
            ))
          ) : (
            <p className="text-gray-500">No members yet.</p>
          )
        ) : eligibleFriends.length > 0 ? (
          eligibleFriends.map((friend) => (
            <MemberCard key={friend.userId} member={friend} isEditing />
          ))
        ) : (
          <p className="text-gray-500">No eligible friends to add.</p>
        )}
      </div>
    </div>
  );
}

export default MemberPanel;
