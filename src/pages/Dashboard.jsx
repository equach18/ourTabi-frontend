import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import UserProfileSidebar from "../components/user/UserProfileSidebar";
import FriendPanel from "../components/friend/FriendPanel";
import TripCard from "../components/trip/TripCard";

function Dashboard({ currentUser, trips }) {
  const [seenWelcome, setSeenWelcome] = useLocalStorage("seenWelcome", false);
  const [showWelcome, setShowWelcome] = useState(!seenWelcome);

  useEffect(() => {
    if (!seenWelcome) {
      const timer = setTimeout(() => {
        setSeenWelcome(true);
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [seenWelcome]);

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6 px-6 pb-10 pt-12">
      {/* Left Sidebar */}
      <div className="w-full">
        <UserProfileSidebar />
      </div>

      <div className="bg-white p-4 rounded-xl shadow h-full overflow-y-auto">
        {showWelcome && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-blue-500 font-heading">
              Welcome back, {currentUser?.username}!
            </h1>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-xl font-semibold text-zinc-700">Your Trips</h2>
          <Link
            to="/trips/new"
            className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            + Create a New Trip
          </Link>
        </div>

        {/* Trip Cards */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {trips.length > 0 ? (
              trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <p className="text-gray-500">No trips yet. Start planning now!</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel (Friends) */}
      <div className="hidden lg:block w-full h-[80vh] overflow-y-auto">
        <FriendPanel />
      </div>
    </div>
  );
}

export default Dashboard;
