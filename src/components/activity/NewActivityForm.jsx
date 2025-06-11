import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import TripContext from "../../context/TripContext";
import Alert from "../common/Alert";

const validCategories = [
  "food",
  "hiking",
  "tours",
  "shopping",
  "adventure",
  "outdoors",
  "other",
];

function NewActivityForm() {
  const { addActivity } = useContext(TripContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "other",
    description: "",
    location: "",
    scheduledTime: "",
  });

  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await addActivity(activityToSubmit);
      navigate(-1);
    } catch (err) {
      setFormErrors(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-600 mb-4">
          Add a New Activity
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* error alerts */}
          <Alert type="error" messages={formErrors} />

          {/* name */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="name">
              Activity Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* category */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {validCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* description */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="description">
              Description (optional)
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              maxLength={500}
            />
          </div>

          {/* location */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="location">
              Location (optional)
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              maxLength={255}
            />
          </div>

          {/* scheduled time */}
          <div>
            <label className="block text-zinc-700 font-medium mb-1" htmlFor="scheduledTime">
              Scheduled Time (optional)
            </label>
            <input
              type="datetime-local"
              name="scheduledTime"
              id="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              className="w-full py-1 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition ${
              isSubmitting && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Activity"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewActivityForm;
