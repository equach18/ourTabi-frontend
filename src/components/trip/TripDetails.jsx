function TripDetails({ trip }) {
  return (
    <div className="space-y-2 text-gray-700">
      <p>
        <strong>Destination:</strong> {trip.destination}
      </p>
      {trip.startDate && (
        <p>
          <strong>Dates:</strong>{" "}
          {new Date(trip.startDate).toLocaleDateString()} -{" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>
      )}
      <p>
        <strong>Privacy:</strong> {trip.isPrivate ? "Private" : "Public"}
      </p>
    </div>
  );
}

export default TripDetails;
