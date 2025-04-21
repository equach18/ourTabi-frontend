import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import FriendsTabs from "./FriendsTabs";
import FriendCard from "./FriendCard";
import SearchFriends from "./SearchFriends";

function FriendPanel() {
  const { currentUser } = useContext(UserContext);

  // 🔥 Simulated data (Replace with API calls)
  const [friends, setFriends] = useState([
    { id: 1, username: "MoonShine", status: "online", avatar: "/avatar1.png" },
    { id: 2, username: "Wingless", status: "online", avatar: "/avatar2.png" },
    {
      id: 3,
      username: "SniperBird",
      status: "offline",
      avatar: "/avatar3.png",
    },
  ]);

  const [friendRequests, setFriendRequests] = useState([
    {
      id: 4,
      username: "DarkKnight",
      status: "pending",
      avatar: "/avatar4.png",
    },
  ]);

  const [sentRequests, setSentRequests] = useState([
    { id: 5, username: "ShadowFox", status: "sent", avatar: "/avatar5.png" },
  ]);

  const [activeTab, setActiveTab] = useState("all"); // "all", "requests", "sent", "search"

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/3">
      <h2 className="text-2xl font-semibold mb-4">Friends</h2>

      {/* 🔥 Tab Selector */}
      <FriendsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        requestCount={friendRequests.length}
        sentCount={sentRequests.length}
      />

      {/* 🔥 Show Content Based on Active Tab */}
      <div className="mt-4">
        {activeTab === "all" &&
          (friends.length > 0 ? (
            friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))
          ) : (
            <p className="text-gray-500">No friends yet.</p>
          ))}

        {activeTab === "requests" &&
          (friendRequests.length > 0 ? (
            friendRequests.map((friend) => (
              <FriendCard key={friend.id} friend={friend} isRequest />
            ))
          ) : (
            <p className="text-gray-500">No friend requests.</p>
          ))}

        {activeTab === "sent" &&
          (sentRequests.length > 0 ? (
            sentRequests.map((friend) => (
              <FriendCard key={friend.id} friend={friend} isSent />
            ))
          ) : (
            <p className="text-gray-500">No sent requests.</p>
          ))}

        {activeTab === "search" && <SearchFriends />}
      </div>
    </div>
  );
}

export default FriendPanel;
