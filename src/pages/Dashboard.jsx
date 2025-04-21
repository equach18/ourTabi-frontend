import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import UserProfileSidebar from "../components/UserProfileSidebar";
import FriendPanel from "./user_main/FriendPanel";

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
    <div className="flex gap-6 p-6">
      <UserProfileSidebar />

      <div className="flex-1">
        {/* Conditional Welcome Message */}
        {showWelcome && (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
            <h1 className="text-3xl font-bold text-blue-500">
              Welcome back, {currentUser?.username}!
            </h1>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6">
          <Link
            to="/trips/new"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            + Create a New Trip
          </Link>
        </div>

        {/* User's Trips */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800">Your Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <Link
                  to={`/trips/${trip.id}`}
                  key={trip.id}
                  className="border p-4 rounded-lg shadow-md hover:shadow-lg"
                >
                  <h3 className="text-xl font-bold">{trip.title}</h3>
                  <p className="text-gray-600">{trip.destination}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No trips yet. Start planning now!</p>
            )}
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/4">
          <FriendPanel />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
