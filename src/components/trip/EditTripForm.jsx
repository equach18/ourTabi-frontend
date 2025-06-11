import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../common/Alert";

function EditTripForm({ editTrip, trips }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === Number(tripId));

  useEffect(() => {
    if (!trip) {
      navigate("/not-found");
    }
  }, [trip, navigate]);

  // initialize form state with formatted date values
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

  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

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
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-600 mb-4">Edit Trip</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* title */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="title">
              Trip Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* destination */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="destination">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              id="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* radius */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="radius">
              Radius (miles/km)
            </label>
            <input
              type="number"
              name="radius"
              id="radius"
              value={formData.radius}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="1"
              required
            />
          </div>

          {/* start date */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="startDate">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formData.startDate || ""}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* end date */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="endDate">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate || ""}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required={!!formData.startDate}
              disabled={!formData.startDate}
            />
          </div>

          {/* privacy */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPrivate"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="text-zinc-700" htmlFor="isPrivate">Private Trip</label>
          </div>

          {/* error alerts */}
          <Alert type="error" messages={formErrors} />

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition ${
                isSubmitting && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTripForm;
