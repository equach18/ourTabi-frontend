import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";
import useToggle from "../../hooks/useToggle";
import Spinner from "../common/Spinner";

/** Signup form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to /companies route
 *
 * Routes -> SignupForm -> Alert
 * Routed as /signup
 */
function SignupForm({signup}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profilePic: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [isLoading, startLoading, stopLoading] = useToggle(false);

  /** Handle form submit */
  async function handleSubmit(evt) {
    evt.preventDefault();
    setFormErrors([]);
    startLoading();

    let result = await signup(formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setFormErrors(result.errors || ["Signup failed."]);
    }
    stopLoading();
  }
  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-blue-500">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-80 mt-4"
      >
        {formErrors.length > 0 && <Alert type="error" messages={formErrors} />}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio (Optional)</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Tell us a little about yourself..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Profile Picture URL (Optional)
          </label>
          <input
            type="url"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>
        <button
          type="submit"
          className={`bg-green-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
