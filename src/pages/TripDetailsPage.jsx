import { useContext, useEffect } from "react";
import TripContext from "../context/TripContext";
import { Link, useNavigate } from "react-router-dom";
import MemberPanel from "../components/member/MemberPanel";
import CommentPanel from "../components/comment/CommentPanel";
import ActivityList from "../components/activity/ActivityList";
import TripDetails from "../components/trip/TripDetails";

function TripDetailsPage({ currentUser, removeTrip }) {
  const { trip, activities, members } = useContext(TripContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!trip) {
      navigate("/not-found");
    }
  }, [trip, navigate]);

  if (!trip || !currentUser) return null;

  const isMember = members?.some((m) => m.userId === currentUser?.id);
  const isTripCreator = trip?.creatorId === currentUser?.id;

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      await removeTrip(trip.id);
      navigate("/dashboard");
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 px-6 pt-10 pb-12 bg-gradient-to-r from-stone-300 via-white to-stone-300">
      <div className="flex flex-col gap-6 overflow-hidden">
        {/* Trip Info */}
        <div className="bg-white p-4 rounded-xl shadow max-h-[45%] overflow-y-auto">
          <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
          <TripDetails trip={trip} />
          {isTripCreator && (
            <div className="space-y-2 mt-4">
              <Link
                to={`/trips/${trip.id}/edit`}
                className="block w-full bg-blue-500 text-white py-1.5 rounded-md text-sm text-center hover:bg-blue-600 transition"
              >
                Edit Trip
              </Link>
              <button
                onClick={handleDelete}
                className="w-full bg-gray-500 text-white py-1.5 rounded-md text-sm hover:bg-gray-600 transition"
              >
                Delete Trip
              </button>
            </div>
          )}
        </div>

        {/* Member Panel */}
        {isMember && (
          <div className="bg-white rounded-xl shadow flex-1 overflow-y-auto">
            <MemberPanel isTripCreator={isTripCreator} members={members} />
          </div>
        )}
      </div>

      {/* Activities */}
      <div className="bg-white p-4 rounded-xl shadow h-full overflow-y-auto">
        <ActivityList activities={activities} trip={trip} />
      </div>

      {/* Comments */}
      {isMember && (
        <div className="bg-white rounded-xl shadow flex flex-col h-full overflow-hidden">
          <CommentPanel />
        </div>
      )}
    </div>
  );
}

export default TripDetailsPage;
