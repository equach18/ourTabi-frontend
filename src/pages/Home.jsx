import { Navigate, Link } from "react-router-dom";
import homePic from "../assets/home.jpg";

function Home({ currentUser }) {
  if (currentUser) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl w-full">
        {/* Left: Content */}
        <div className="w-full max-w-xl text-center md:text-left space-y-6">
          <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold">
            Your shared journey begins here
          </p>
          <h1 className="text-4xl font-bold text-orange-500">
            Welcome to OurTabi!
          </h1>
          <p className="text-lg text-zinc-800">
            Plan your trips, invite friends, and create unforgettable travel
            experiences. Make travel planning effortless at OurTabi.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-slate-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-slate-600 transition-transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-emerald-700 transition-transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
        {/* 
        Right: Image
        <div className="w-full md:w-1/2 max-h-[580px] overflow-hidden rounded-xl">
          <img
            src={homePic}
            alt="Japanese temple"
            className="w-full h-full object-cover"
          />
        </div> */}
        <div className="relative group w-full md:w-1/2 h-[580px] rounded-xl overflow-hidden shadow-xl border border-stone-200">
          {/* Image */}
          <img
            src={homePic}
            alt="Japanese temple"
            className="w-full h-full object-cover transition duration-500 group-hover:opacity-0"
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 bg-white text-zinc-700 p-6 flex flex-col justify-center items-center opacity-0 transition duration-800 group-hover:opacity-400">
            <h3 className="text-xl font-semibold text-orange-500 mb-4">
              Why OurTabi?
            </h3>
            <ul className="space-y-3 text-sm text-center">
              <li>Plan group trips easily</li>
              <li>Vote on activities</li>
              <li>Chat with trip members</li>
              <li>Explore other itineraries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
