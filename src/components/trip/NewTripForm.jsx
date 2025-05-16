import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";

function NewTripForm({ addTrip }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    radius: 10,
    startDate: "",
    endDate: "",
    isPrivate: true, // Default to private
  });
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Handle form field change */
  function handleChange(evt) {
    const { name, value, type, checked } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /** Handle form submit */
  async function handleSubmit(evt) {
    evt.preventDefault();
    setFormErrors([]);
    setIsSubmitting(true);

    if (
      formData.startDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      setFormErrors(["End date must be after start date."]);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await addTrip(formData);
      if (result.success) {
        navigate(`/trips/${result.trip.id}`);
      } else {
        setFormErrors([
          result.error?.message ||
            String(result.error || "Failed to create trip."),
        ]);
      }
    } catch (err) {
      setFormErrors([err.message || String(err)]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-600 mb-4">
          Create A New Trip
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Radius */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Radius (miles/km)
            </label>
            <input
              type="number"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="1"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required={!!formData.startDate}
              disabled={!formData.startDate}
            />
          </div>

          {/* Private Trip */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="text-zinc-700">Private Trip</label>
          </div>

          {/* Errors */}
          {formErrors.length > 0 && (
            <div className="text-red-600 text-sm space-y-1">
              {formErrors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition ${
              isSubmitting && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewTripForm;
