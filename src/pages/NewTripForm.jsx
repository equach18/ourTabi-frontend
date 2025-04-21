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
      } else{
        setFormErrors([result.error])
      }
    } catch (err) {
      setFormErrors([err]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-500">Create a New Trip</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
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

        {/* Start Date (optional) */}
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* End Date (required only if startDate exists) */}
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required={!!formData.startDate} // Require only if startDate exists
            disabled={!formData.startDate} // Disable unless startDate is filled
          />
        </div>

        {/* Private Trip Checkbox */}
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
        {formErrors.length > 0 && <Alert type="error" messages={formErrors} />}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </div>
  );
}

export default NewTripForm;
