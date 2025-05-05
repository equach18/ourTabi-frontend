import { useContext, useEffect } from "react";
import TripContext from "../context/TripContext";
import { Link, useNavigate } from "react-router-dom";
import MemberPanel from "../components/member/MemberPanel";
import CommentPanel from "../components/comment/CommentPanel";
import ActivityList from "../components/activity/ActivityList";

function TripDetails({ currentUser, removeTrip }) {
  const { trip, activities, members } = useContext(TripContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!trip) {
      navigate("/not-found");
    }
  }, [trip, navigate]);

  // handle limited access on trip details if user is not  a member
  const isMember = members.some((m) => m.userId === currentUser.id);
  // handle limited access if user is not the owner
  const isTripCreator = trip.creatorId === currentUser.id;

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      await removeTrip(trip.id);
      navigate("/dashboard");
    }
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      {/* Trip Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        {isTripCreator && (
          <div className="space-x-4">
            <Link
              to={`/trips/${trip.id}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Edit Trip
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete Trip
            </button>
          </div>
        )}
      </div>

      {/* Trip Details */}
      <p className="text-gray-600 mt-4">
        <strong>Destination:</strong> {trip.destination}
      </p>
      {trip.startDate && (
        <p className="text-gray-600">
          <strong>Dates:</strong>{" "}
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>
      )}
      <p className="text-gray-600">
        <strong>Privacy:</strong> {trip.isPrivate ? "Private" : "Public"}
      </p>

      {/* Activities Section */}
      <div className="mt-8">
        <ActivityList activities={activities} trip={trip} />
      </div>

      {/* Members Section */}
      {isMember && (
        <div className="mt-8">
          <MemberPanel isTripCreator={isTripCreator} members={members} />
        </div>
      )}

      {/* Comments Section */}
      {isMember && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Comments</h2>
          <CommentPanel />
        </div>
      )}
    </div>
  );
}

export default TripDetails;
