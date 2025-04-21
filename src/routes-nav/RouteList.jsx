import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import LoginForm from "../pages/LoginForm";
import SignupForm from "../pages/SignupForm";
import NewTripForm from "../pages/NewTripForm";
import TripDetails from "../pages/trips/TripDetails";
import NewActivityForm from "../pages/trips/NewActivityForm";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import UserContext from "../context/UserContext";
import TripProvider from "../context/TripProvider";
import EditTripForm from "../pages/trips/EditTripForm";
import EditActivityForm from "../pages/trips/EditActivityForm";
import EditProfileForm from "../pages/user_main/EditProfileForm";

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
        <Route path="/profile/edit" element={<EditProfileForm currentUser={currentUser} updateUser={updateUser} />} />
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
