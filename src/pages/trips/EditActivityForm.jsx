import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TripContext from "../../context/TripContext";

function EditActivityForm() {
  const { activities, deleteActivity, editActivity } = useContext(TripContext);
  const { activityId } = useParams(); // Get activity ID from URL params
  const navigate = useNavigate();

  const validCategories = [
    "food",
    "hiking",
    "tours",
    "shopping",
    "adventure",
    "outdoors",
    "other",
  ];

  // Find the activity being edited
  const activity = activities.find((a) => a.id === Number(activityId));

  const [formData, setFormData] = useState({
    name: activity?.name || "",
    category: activity?.category || "",
    location: activity?.location || "",
    description: activity?.description || "",
    scheduledTime: activity?.scheduledTime
      ? new Date(activity.scheduledTime).toISOString().split("T")[0]
      : undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  /** Handles input changes */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setIsSubmitting(true);
    setFormErrors([]);

    try {
      await editActivity(activity.id, formData);
      navigate(`/trips/${activity.tripId}`);
    } catch (err) {
      setFormErrors(["Error updating activity. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Handle delete */
  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      await deleteActivity(activity.id);
      navigate(`/trips/${activity.tripId}`);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-500">Edit Activity</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Activity Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            {validCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Scheduled Time */}
        <div className="mb-4">
          <label className="block text-gray-700">Scheduled Time</label>
          <input
            type="date"
            name="scheduledTime"
            value={formData.scheduledTime || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
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
            onClick={() => navigate(`/trips/${activity.tripId}`)}
          >
            Cancel
          </button>
        </div>

        <button
          type="button"
          className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg w-full"
          onClick={handleDelete}
        >
          Delete Activity
        </button>
      </form>
    </div>
  );
}

export default EditActivityForm;
