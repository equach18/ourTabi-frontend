import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import LoginForm from "../components/user/LoginForm";
import SignupForm from "../components/user/SignupForm";
import NewTripForm from "../components/trip/NewTripForm";
import TripDetails from "../pages/TripDetails";
import NewActivityForm from "../components/activity/NewActivityForm";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import UserContext from "../context/UserContext";
import TripProvider from "../context/TripProvider";
import EditTripForm from "../components/trip/EditTripForm";
import EditActivityForm from "../components/activity/EditActivityForm";
import EditProfileForm from "../components/user/EditProfileForm";
import TripSearchResults from "../pages/TripSearchResults";

function RouteList() {
  const {
    currentUser,
    trips,
    login,
    signup,
    addTrip,
    editTrip,
    isLoading,
    removeTrip,
    updateUser,
  } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Home currentUser={currentUser} />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />

      {/* Protected Routes: Only accessible if logged in */}
      <Route
        element={
          <PrivateRoute currentUser={currentUser} isLoading={isLoading} />
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard currentUser={currentUser} trips={trips} />}
        />
        <Route
          path="/profile/edit"
          element={
            <EditProfileForm
              currentUser={currentUser}
              updateUser={updateUser}
            />
          }
        />
        <Route path="/trips/new" element={<NewTripForm addTrip={addTrip} />} />
        <Route
          path="/trips/:tripId"
          element={
            <TripProvider>
              <TripDetails currentUser={currentUser} removeTrip={removeTrip} />
            </TripProvider>
          }
        />
        <Route
          path="/trips/:tripId/edit"
          element={<EditTripForm editTrip={editTrip} trips={trips} />}
        />
        <Route path="/search" element={<TripSearchResults />} />
        <Route
          path="/trips/:tripId/activities/new"
          element={
            <TripProvider>
              <NewActivityForm />
            </TripProvider>
          }
        />
        <Route
          path="/trips/:tripId/activities/:activityId/edit"
          element={
            <TripProvider>
              <EditActivityForm />
            </TripProvider>
          }
        />
      </Route>
      {/* Handle 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RouteList;
