import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import UserContext from "./UserContext";
import OurTabiApi from "../api/ourTabiApi";
import Spinner from "../common/Spinner";
import { jwtDecode } from "jwt-decode";

function UserProvider({ children }) {
  const [token, setToken] = useLocalStorage("token", null);
  const [currentUser, setCurrentUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequest] = useState([]);

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
          setFriendRequest(user.friendRequests);
          setTrips(user.trips)
        } catch (err) {
          console.error("Failed to load user:", err);
          setCurrentUser(null);
          setTrips([]);
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
        role: "owner"
      };

      setTrips((prevTrips) => [...prevTrips, newTrip]);

      return { success: true, trip: data };
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
        role: "owner"
      };

      setTrips((prevTrips) =>
        prevTrips.map((trip) => (trip.id === tripId ? updatedTripWithRole : trip))
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
  async function addFriend(username){
    try{
      await OurTabiApi.sendFriendRequest(username);
    }catch(err){
      console.error("Error adding friend:", err.response?.data || err.message)
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
