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
    const formattedScheduledTime = formData.scheduledTime
      ? new Date(formData.scheduledTime).toISOString()
      : undefined;

    const activityToSubmit = {
      ...formData,
      scheduledTime: formattedScheduledTime,
    };

    try {
      await editActivity(activity.id, activityToSubmit);
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
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-600 mb-4">Edit Activity</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Error Messages */}
          {formErrors.length > 0 && (
            <div className="text-red-600 text-sm space-y-1">
              {formErrors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Activity Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Scheduled Time */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              name="scheduledTime"
              value={formData.scheduledTime || ""}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
              onClick={() => navigate(`/trips/${activity.tripId}`)}
            >
              Cancel
            </button>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            onClick={handleDelete}
          >
            Delete Activity
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditActivityForm;
