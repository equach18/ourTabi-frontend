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
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-600 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Profile Pic */}
          <input
            type="url"
            name="profilePic"
            placeholder="Profile Picture URL"
            value={formData.profilePic}
            onChange={handleChange}
            className="w-full py-2 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Bio */}
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full py-2 px-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Errors */}
          {formErrors.length > 0 && (
            <div className="text-red-600 text-sm space-y-1">
              {formErrors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-zinc-400 text-white px-5 py-2 rounded-lg hover:bg-zinc-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition ${
                isSubmitting && "opacity-50 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;
