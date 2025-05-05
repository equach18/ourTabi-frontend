import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfileForm({ updateUser, currentUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    profilePic: currentUser.profilePic || "",
    bio: currentUser.bio || "",
  });

  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setFormErrors([]);
    setIsSubmitting(true);

    // Filter unchanged fields
    const updatedFields = {};
    for (let key in formData) {
      if (formData[key] !== currentUser[key]) {
        updatedFields[key] = formData[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      setFormErrors(["No changes made."]);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await updateUser(updatedFields);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setFormErrors([result.error]);
      }
    } catch (err) {
      setFormErrors([err.message || "Failed to update profile."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        {/* Last Name */}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        {/* Profile Picture */}
        <input
          type="url"
          name="profilePic"
          placeholder="Profile Picture URL"
          value={formData.profilePic}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          rows="4"
        />

        {/* Errors */}
        {formErrors.length > 0 && (
          <div className="text-red-500">
            {formErrors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;