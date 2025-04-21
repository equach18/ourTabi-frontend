import { useContext, useEffect } from "react";
import TripContext from "../../context/TripContext";
import { Link, useNavigate } from "react-router-dom";
// import MembersList from "./MembersList";
// import CommentsSection from "./CommentsSection";
import ActivityList from "./ActivityList";

function TripDetails({ currentUser, removeTrip }) {
  
  const { trip, activities } = useContext(TripContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!trip) {
      navigate("/not-found");
    }
  }, [trip, navigate]);

  // handle limited access on trip details if user is not a a member
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

      {/* Members Section */}
      {/* <MembersList /> */}

      {/* Activities Section */}
      <div className="mt-8">
        <ActivityList activities={activities} trip={trip} />
      </div>

      {/* Comments Section */}
      {/* <div className="mt-8">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <CommentsSection />
      </div> */}
    </div>
  );
}

export default TripDetails;
