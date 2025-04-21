import UserContext from "../../context/UserContext";
import { useContext } from "react";
import ActivityCard from "./ActivityCard";
import { Link } from "react-router-dom";

function ActivityList({ activities, trip }) {
  const { currentUser } = useContext(UserContext);

  const isTripMember = trip.members?.some(
    (member) => member.username === currentUser.username
  );

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Activities</h2>
        {isTripMember && (
          <Link
            to={`/trips/${trip.id}/activities/new`}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            + Add Activity
          </Link>
        )}
      </div>

      {/* Show list of activities */}
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} isTripMember={isTripMember}/>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No activities yet. Add one now!</p>
      )}
    </div>
  );
}

export default ActivityList;
