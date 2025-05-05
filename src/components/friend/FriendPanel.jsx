import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import FriendTabs from "./FriendTabs";
import FriendCard from "./FriendCard";
import FriendSearch from "./FriendSearch";

function FriendPanel() {
  const { friends, incomingRequests, sentRequests } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState("all"); // "all", "requests", "sent", "search"
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full md:w-1/3">
      <h2 className="text-2xl font-semibold mb-4">Friends</h2>

      {/* Tab Selector */}
      <FriendTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        requestCount={incomingRequests.length}
        sentCount={sentRequests.length}
      />

      {/* Show Content Based on Active Tab */}
      <div className="mt-4">
        {activeTab === "all" &&
          (friends.length > 0 ? (
            friends.map((friend) => (
              <FriendCard key={friend.userId} friend={friend} />
            ))
          ) : (
            <p className="text-gray-500">No friends yet.</p>
          ))}

        {activeTab === "requests" &&
          (incomingRequests.length > 0 ? (
            incomingRequests.map((friend) => (
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

        {activeTab === "search" && <FriendSearch />}
      </div>
    </div>
  );
}

export default FriendPanel;
