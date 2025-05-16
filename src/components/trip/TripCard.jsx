import { Link } from "react-router-dom";

function TripCard({ trip }) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="bg-white border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg block transition duration-200"
    >
      <h3 className="text-xl font-semibold text-blue-600">{trip.title}</h3>
      <p className="text-gray-700 text-sm flex items-center gap-1 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        {trip.destination}
      </p>

      {trip.startDate && trip.endDate && (
        <p className="text-sm text-gray-500 mt-1">
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>
      )}

      {trip.isPrivate && (
        <span className="inline-block mt-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
          Private
        </span>
      )}
    </Link>
  );
}

export default TripCard;
