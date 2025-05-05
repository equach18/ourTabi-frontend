import { Link } from "react-router-dom";

function TripCard({ trip }) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="border p-4 rounded-lg shadow-md hover:shadow-lg block transition duration-200"
    >
      <h3 className="text-xl font-bold text-blue-600">{trip.title}</h3>
      <p className="text-gray-700">{trip.destination}</p>

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
