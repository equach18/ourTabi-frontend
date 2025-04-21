import { useContext } from "react";
import TripContext from "../../context/TripContext";
import { Link } from "react-router-dom";
import ActivityVoteButtons from "./ActivityVoteButtons";

function ActivityCard({ activity, isTripMember }) {
  return (
    <div className="border p-4 rounded-lg shadow-md hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{activity.name}</h3>

        {/* Edit Button (Only for trip members) */}
        {isTripMember && (
          <Link
            to={`/trips/${activity.tripId}/activities/${activity.id}/edit`}
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
          >
            Edit
          </Link>
        )}
      </div>

      <p className="text-gray-600">{activity.category}</p>
      <p className="text-gray-600">{activity.location}</p>
      <p className="text-gray-500">{activity.description}</p>

      {/* Activity Vote Buttons - only show if the user is a trip member */}
      {isTripMember && <ActivityVoteButtons activityId={activity.id} />}
    </div>
  );
}

export default ActivityCard;
