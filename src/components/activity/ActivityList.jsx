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
    <div className="h-full flex flex-col bg-white px-2 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-semibold">Activities</h2>
        {isTripMember && (
          <Link
            to={`/trips/${trip.id}/activities/new`}
            className="bg-emerald-500 text-white px-3 py-2 rounded-md  hover:bg-emerald-600"
          >
            Add Activity
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isTripMember={isTripMember}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-4">No activities yet</p>
        )}
      </div>
    </div>
  );
}

export default ActivityList;
