import { useContext } from "react";
import UserContext from "../../context/UserContext";

function FriendCard({
  friend,
  isRequest = false,
  isSent = false,
  isSearchResult = false,
}) {
  const { acceptRequest, removeFriendship, sendRequest } =
    useContext(UserContext);

  function handleAcceptFriend() {
    acceptRequest(friend); 
  }

  function handleRemoveFriend() {
      removeFriendship(friend); 
  }

  function handleSendRequest() {
    sendRequest(friend); 
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-3">
      <div className="flex items-center gap-3">
        <img
          src={friend.profilePic || "/default-avatar.png"}
          alt={`${friend.username}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">
            {friend.firstName} {friend.lastName}
          </p>
          <p className="text-sm text-gray-500">@{friend.username}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {isRequest && (
          <>
            <button
              onClick={handleAcceptFriend}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Accept
            </button>
            <button
              onClick={handleRemoveFriend}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Decline
            </button>
          </>
        )}

        {isSent && (
          <button
            onClick={handleRemoveFriend}
            className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        )}

        {!isRequest && !isSent && !isSearchResult && (
          <button
            onClick={handleRemoveFriend}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Remove
          </button>
        )}

        {isSearchResult && (
          <button
            onClick={handleSendRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Add Friend
          </button>
        )}

        {/* {onAdd && (
          <button
            onClick={handleAdd}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
          >
            Add to Trip
          </button>
        )} */}
      </div>
    </div>
  );
}

export default FriendCard;