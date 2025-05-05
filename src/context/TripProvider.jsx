import { useState, useEffect } from "react";
import TripContext from "./TripContext";
import OurTabiApi from "../api/ourTabiApi";
import Spinner from "../components/common/Spinner";
import { useParams } from "react-router-dom";

function TripProvider({ children }) {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [members, setMembers] = useState([]);
  const [votes, setVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const tripData = await OurTabiApi.getTrip(tripId);
        const activitiesData = await OurTabiApi.getActivities(tripId);

        setTrip(tripData);

        const filteredActivities = activitiesData.map(
          ({
            id,
            tripId,
            name,
            category,
            description,
            location,
            scheduledTime,
            createdBy,
            createdAt,
          }) => ({
            id,
            tripId,
            name,
            category,
            description,
            location,
            scheduledTime,
            createdBy,
            createdAt,
          })
        );
        setActivities(filteredActivities);

        setComments(tripData.comments);
        setMembers(tripData.members);

        const votesByActivity = {};
        activitiesData.forEach((activity) => {
          votesByActivity[activity.id] = activity.votes || [];
        });
        setVotes(votesByActivity);
      } catch (err) {
        console.error("Error loading trip:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrip();
  }, [tripId]);

  /** Add a member to the trip*/
  async function addMember(friend) {
    try {
      const data = await OurTabiApi.addTripMember(friend.userId, tripId);
      const newMember = {
        id: data.id,
        userId: friend.userId,
        username: friend.username,
        firstName: friend.firstName,
        profilePic: friend.profilePic,
        role: "member",
      };
      setMembers((prev) => [...prev, newMember]);
    } catch (err) {
      console.error("Error adding member:", err);
    }
  }

  /** Remove a member from a trip*/
  async function removeMember(member) {
    try {
      await OurTabiApi.removeTripMember(member.id, tripId);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err) {
      console.error("Error removing member:", err);
    }
  }

  /** Add a new activity */
  async function addActivity(activityData) {
    try {
      const newActivity = await OurTabiApi.addActivity(tripId, activityData);
      setActivities((prev) => [...prev, newActivity]);
    } catch (err) {
      console.error("Error adding activity:", err);
    }
  }

  /** Edit an existing activity */
  async function editActivity(activityId, updatedData) {
    try {
      const updatedActivity = await OurTabiApi.updateActivity(
        tripId,
        activityId,
        updatedData
      );
      setActivities((prev) =>
        prev.map((a) => (a.id === activityId ? updatedActivity : a))
      );
    } catch (err) {
      console.error("Error updating activity:", err);
    }
  }

  /** Delete an activity */
  async function deleteActivity(activityId) {
    try {
      await OurTabiApi.deleteActivity(tripId, activityId);
      setActivities((prev) =>
        prev.filter((activity) => activity.id !== activityId)
      );
    } catch (err) {
      console.error("Error deleting activity:", err);
    }
  }

  /** Vote on activity */
  async function voteOnActivity(activityId, voteValue) {
    try {
      const vote = await OurTabiApi.voteOnActivity(
        tripId,
        activityId,
        voteValue
      );

      setVotes((prevVotes) => {
        const updatedVotes = { ...prevVotes };

        // Find existing votes for this activity
        const activityVotes = updatedVotes[activityId] || [];

        // Check if the user has already voted
        const existingVoteIndex = activityVotes.findIndex(
          (v) => v.userId === vote.userId
        );

        // Update existing vote if found
        if (existingVoteIndex !== -1) {
          activityVotes[existingVoteIndex] = vote;
        } else {
          activityVotes.push(vote);
        }

        updatedVotes[activityId] = activityVotes;
        return updatedVotes;
      });

      // Update activities state to reflect the vote
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === activityId
            ? {
                ...activity,
                votes: votes[activityId] || [], // Ensure it reflects votes correctly
              }
            : activity
        )
      );
    } catch (err) {
      console.error("Error voting on activity:", err);
    }
  }

  /** Add a new comment */
  async function addComment(text) {
    try {
      const newComment = await OurTabiApi.addComment(tripId, text);
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  }

  /** Delete a comment */
  async function deleteComment(commentId) {
    try {
      await OurTabiApi.deleteComment(tripId, commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  }
  if (isLoading) return <Spinner />;

  return (
    <TripContext.Provider
      value={{
        trip,
        activities,
        members,
        comments,
        votes,
        isLoading,
        tripId,
        addActivity,
        editActivity,
        deleteActivity,
        voteOnActivity,
        addComment,
        deleteComment,
        addMember,
        removeMember,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export default TripProvider;
