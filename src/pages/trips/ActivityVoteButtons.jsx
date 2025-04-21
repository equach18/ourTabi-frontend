import { useContext } from "react";
import TripContext from "../../context/TripContext";
import UserContext from "../../context/UserContext";

function ActivityCardButtons({ activityId }) {
  const { currentUser } = useContext(UserContext);
  const { voteOnActivity, votes } = useContext(TripContext);

  // Get votes for this activity 
  const activityVotes = votes[activityId] || [];

  // Get the user's vote
  const userVote =
    activityVotes.find((v) => v.userId === currentUser?.id)?.voteValue || 0;

  // Count total upvotes & downvotes
  const totalUpvotes = activityVotes.filter((v) => v.voteValue === 1).length;
  const totalDownvotes = activityVotes.filter((v) => v.voteValue === -1).length;

  async function handleVote(voteValue) {
    if (voteValue === userVote) voteValue = 0; 
    await voteOnActivity(activityId, voteValue);
  }

  return (
    <div className="flex items-center space-x-2 mt-3">
      {/* Upvote Button */}
      <button
        className={`px-2 py-1 rounded ${
          userVote === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleVote(1)}
      >
        👍 {totalUpvotes}
      </button>

      {/* Downvote Button */}
      <button
        className={`px-2 py-1 rounded ${
          userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleVote(-1)}
      >
        👎 {totalDownvotes}
      </button>

    </div>
  );
}

export default ActivityCardButtons;
