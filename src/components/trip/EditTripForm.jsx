import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditTripForm({ editTrip, trips }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === Number(tripId));

  useEffect(() => {
    if (!trip) {
      navigate("/not-found");
    }
  }, [trip, navigate]);

  // Initialize form state with formatted date values
  const [formData, setFormData] = useState({
    title: trip.title || "",
    destination: trip.destination || "",
    radius: trip.radius || 10,
    startDate: trip.startDate
      ? new Date(trip.startDate).toISOString().split("T")[0]
      : "",
    endDate: trip.endDate
      ? new Date(trip.endDate).toISOString().split("T")[0]
      : "",
    isPrivate: trip.isPrivate || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  /** Handles input changes */
  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /** Handles form submission */
  async function handleSubmit(evt) {
    evt.preventDefault();
    setIsSubmitting(true);
    setFormErrors([]);

    try {
      await editTrip(trip.id, formData);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setFormErrors(["Error updating trip. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-500">Edit Trip</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Trip Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Destination */}
        <div className="mb-4">
          <label className="block text-gray-700">Destination</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Radius */}
        <div className="mb-4">
          <label className="block text-gray-700">Radius (miles/km)</label>
          <input
            type="number"
            name="radius"
            value={formData.radius}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            min="1"
            required
          />
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required={!!formData.startDate} // Only required if startDate exists
            disabled={!formData.startDate} // Disable unless startDate is filled
          />
        </div>

        {/* Privacy Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="mr-2"
            />
            Private Trip
          </label>
        </div>

        {/* Error Messages */}
        {formErrors.length > 0 && (
          <div className="text-red-500">
            {formErrors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Submit & Cancel Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-3 rounded-lg w-full"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTripForm;
