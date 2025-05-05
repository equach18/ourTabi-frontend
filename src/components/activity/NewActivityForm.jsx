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

  /** Handle form submission */
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add a New Activity</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {formErrors.length > 0 && <Alert type="error" messages={formErrors} />}

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

        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            {validCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Description (optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            maxLength={500}
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700">Location (optional)</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            maxLength={255}
          />
        </div>

        {/* Scheduled Time */}
        <div className="mb-4">
          <label className="block text-gray-700">
            Scheduled Time (optional)
          </label>
          <input
            type="datetime-local"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Activity"}
        </button>
      </form>
    </div>
  );
}

export default NewActivityForm;
