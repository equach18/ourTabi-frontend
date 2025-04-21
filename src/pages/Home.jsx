import { Navigate, Link } from "react-router-dom";

function Home({currentUser}) {

  // Redirect logged-in users to the dashboard
  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <div className="container mx-auto text-center mt-20 max-w-2xl">
      {/* Welcome Section */}
      <h1 className="text-4xl font-bold text-blue-500">Welcome to OurTabi!</h1>
      <p className="text-lg mt-4 text-gray-700">
        Plan your trips, invite friends, and create unforgettable travel
        experiences. Organize everything in one place and make travel planning
        effortless.
      </p>

      {/* Call to Action for Non-Logged-In Users */}
      <div className="mt-6 space-x-4">
        <Link
          to="/login"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
