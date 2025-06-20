import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import FriendTabs from "./FriendTabs";
import FriendCard from "./FriendCard";
import FriendSearchForm from "./FriendSearchForm";

function FriendPanel() {
  const { friends, incomingRequests, sentRequests } = useContext(UserContext);
  // includes "all", "requests", "sent", "search"
  const [activeTab, setActiveTab] = useState("all"); 
  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-800 mb-2">Friends</h2>
        <FriendTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          requestCount={incomingRequests.length}
          sentCount={sentRequests.length}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {activeTab === "all" &&
          (friends.length > 0 ? (
            friends.map((friend) => (
              <FriendCard key={friend.userId} friend={friend} isFriend/>
            ))
          ) : (
            <p className="text-gray-500">No friends yet.</p>
          ))}

        {activeTab === "requests" &&
          (incomingRequests.length > 0 ? (
            incomingRequests.map((friend) => (
              <FriendCard key={friend.userId} friend={friend} isRequest />
            ))
          ) : (
            <p className="text-gray-500">No friend requests.</p>
          ))}

        {activeTab === "sent" &&
          (sentRequests.length > 0 ? (
            sentRequests.map((friend) => (
              <FriendCard key={friend.userId} friend={friend} isSent />
            ))
          ) : (
            <p className="text-gray-500">No sent requests.</p>
          ))}

        {activeTab === "search" && <FriendSearchForm />}
      </div>
    </div>
  );
}

export default FriendPanel;
