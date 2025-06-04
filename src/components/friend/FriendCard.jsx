import { useContext } from "react";
import UserContext from "../../context/UserContext";
import defaultProfilePic from "../../assets/profilePic.jpg";

function FriendCard({
  friend,
  isRequest = false,
  isFriend = false,
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
          src={friend.profilePic || defaultProfilePic}
          alt={`${friend.username}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-sm">
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
              className="bg-green-500 hover:bg-green-600 text-white px-1 py-1 rounded text-sm"
              aria-label="accept"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </button>
            <button
              onClick={handleRemoveFriend}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-1 py-1 rounded text-sm"
              aria-label="decline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
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

        {isFriend && (
          <button
            onClick={handleRemoveFriend}
            className="bg-red-500 hover:bg-red-600 text-white px-2 rounded text-sm"
          >
            X
          </button>
        )}

        {isSearchResult && (
          <button
            onClick={handleSendRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export default FriendCard;
