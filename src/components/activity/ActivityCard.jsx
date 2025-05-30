import { Link } from "react-router-dom";
import ActivityVoteButtons from "./ActivityVoteButtons";

/** Displays activity details and allows voting/editing options if the user is a member of the trip */
function ActivityCard({ activity, isTripMember }) {
  return (
    <div className="border border-zinc-300 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white">
      <div className="flex justify-between items-start gap-4">
        {/* Activity info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-zinc-800">{activity.name}</h3>
            {isTripMember && (
              <Link
                to={`/trips/${activity.tripId}/activities/${activity.id}/edit`}
                className="text-yellow-500 hover:text-yellow-600 transition"
                title="Edit Activity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </Link>
            )}
          </div>

          <p className="text-sm text-zinc-600">
            <strong>Category:</strong> {activity.category}
          </p>

          {activity.location && (
            <p className="text-sm text-zinc-600">
              <strong>Location:</strong> {activity.location}
            </p>
          )}

          {activity.description && (
            <p className="text-sm text-zinc-500">
              <strong>Description:</strong> {activity.description}
            </p>
          )}

          {activity.scheduledTime && (
            <p className="text-sm text-zinc-500">
              <strong>Scheduled:</strong>{" "}
              {new Date(activity.scheduledTime).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        {/* Voting */}
        {isTripMember && (
          <div className="flex items-center">
            <ActivityVoteButtons activityId={activity.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
