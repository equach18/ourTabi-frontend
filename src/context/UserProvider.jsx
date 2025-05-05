import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import UserContext from "./UserContext";
import OurTabiApi from "../api/ourTabiApi";
import Spinner from "../components/common/Spinner";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function UserProvider({ children }) {
  const [token, setToken] = useLocalStorage("token", null);
  const [currentUser, setCurrentUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const navigate = useNavigate();
  // Load user profile if token exists
  useEffect(() => {
    async function getCurrentUser() {
      setIsLoading(true);
      if (token) {
        try {
          OurTabiApi.setToken(token);
          const { username } = jwtDecode(token);
          const user = await OurTabiApi.getUser(username);
          setCurrentUser(user);

          setFriends(user.friends);
          setIncomingRequests(user.incomingRequests);
          setSentRequests(user.sentRequests);

          setTrips(user.trips);
        } catch (err) {
          console.error("Failed to load user:", err);
          setCurrentUser(null);
          setTrips([]);
          // redirect the the login page and pass error
          if (
            Array.isArray(err) &&
            err[0] === "You do not have permission to access this page."
          ) {
            navigate("/login", { state: { alert: err[0] } });
          }
        }
      } else {
        setCurrentUser(null);
        setTrips([]);
      }
      setIsLoading(false);
    }
    getCurrentUser();
  }, [token]);

  /** Login function */
  async function login(loginData) {
    try {
      const newToken = await OurTabiApi.login(loginData);
      setToken(newToken);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  /** Signup  */
  async function signup(signupData) {
    try {
      const newToken = await OurTabiApi.signup(signupData);
      setToken(newToken);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  /** Logout  */
  function logout() {
    setToken(null);
    setCurrentUser(null);
    setTrips([]);
    localStorage.removeItem("seenWelcome");
  }

  /** Update user profile */
  async function updateUser(formInput) {
    try {
      const updatedFields = await OurTabiApi.updateUser(
        currentUser.username,
        formInput
      );

      const updatedUser = {
        ...currentUser,
        ...updatedFields,
      };

      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message,
      };
    }
  }

  /** Function to add new trip  */
  async function addTrip(formInput) {
    try {
      const tripData = {
        ...formInput,
        startDate: formInput.startDate || undefined,
        endDate: formInput.endDate || undefined,
      };

      const createdTrip = await OurTabiApi.createTrip(tripData);

      const newTrip = {
        ...createdTrip,
        role: "owner",
      };

      setTrips((prevTrips) => [...prevTrips, newTrip]);

      return { success: true, trip: newTrip };
    } catch (err) {
      return { success: false, error: err };
    }
  }

  /** Function to edit a trip */
  async function editTrip(tripId, formInput) {
    try {
      const tripData = {
        ...formInput,
        startDate: formInput.startDate || undefined,
        endDate: formInput.endDate || undefined,
      };

      // Send update request to API
      const updatedTrip = await OurTabiApi.updateTrip(tripId, tripData);

      const updatedTripWithRole = {
        ...updatedTrip,
        role: "owner",
      };

      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === tripId ? updatedTripWithRole : trip
        )
      );

      return { success: true, trip: updatedTrip };
    } catch (err) {
      console.error("Error updating trip:", err.response?.data || err.message);
      return { success: false, error: err };
    }
  }

  /** Function to remove a trip */
  async function removeTrip(tripId) {
    try {
      await OurTabiApi.deleteTrip(tripId);

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));

      return { success: true };
    } catch (err) {
      console.error("Error deleting trip:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error || "An unexpected error occurred.",
      };
    }
  }

  /** Function to send a friend request */
  async function sendRequest(recipient) {
    try {
      const newReq = await OurTabiApi.sendFriendRequest(recipient.id);
      const newSent = {
        friendId: newReq.id,
        userId: recipient.id,
        username: recipient.username,
        firstName: recipient.firstName,
        lastName: recipient.lastName,
        email: recipient.email,
        profilePic: recipient.profilePic,
      };

      setSentRequests((prev) => [...prev, newSent]);
    } catch (err) {
      console.error("Error adding friend:", err.response?.data || err.message);
    }
  }

  /** Function to accept a friend request */
  async function acceptRequest(friend) {
    try {
      await OurTabiApi.acceptFriendRequest(friend.friendId);

      // const newFriend = {
      //   id: friend.id,

      //   username: friend.username,
      //   firstName: friend.firstName,
      //   lastName: friend.lastName,
      //   email: friend.email,
      //   profilePic: friend.profilePic,
      // };
      setFriends((prev) => [...prev, friend]);

      // Remove from incomingRequests
      setIncomingRequests((prev) => prev.filter((f) => f.id !== friend.id));
    } catch (err) {
      console.error(
        "Error accepting friend request:",
        err.response?.data || err.message
      );
    }
  }
  /** Function to send a friend request */
  async function removeFriendship(friend) {
    try {
      await OurTabiApi.removeFriend(friend.friendId);

      // Remove from all friend lists
      setFriends((prev) => prev.filter((f) => f.friendId !== friend.friendId));
      setIncomingRequests((prev) =>
        prev.filter((f) => f.friendId !== friend.friendId)
      );
      setSentRequests((prev) =>
        prev.filter((f) => f.friendId !== friend.friendId)
      );
    } catch (err) {
      console.error(
        "Error removing friend:",
        err.response?.data || err.message
      );
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        trips,
        updateUser,
        addTrip,
        editTrip,
        token,
        login,
        signup,
        logout,
        removeTrip,
        friends,
        incomingRequests,
        sentRequests,
        sendRequest,
        acceptRequest,
        removeFriendship,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
