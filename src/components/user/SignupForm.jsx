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
function SignupForm({ signup }) {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-r from-stone-300 via-white to-stone-300 px-4">
      <h1 className="text-3xl font-bold text-orange-500 font-heading mb-4">
        Create an Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[calc(100vh-6rem)] overflow-y-auto"
      >
        {formErrors.length > 0 && (
          <div className="mb-4">
            <Alert type="error" messages={formErrors} />
          </div>
        )}

        {[
          ["Username", "username", "text"],
          ["Password", "password", "password"],
          ["First Name", "firstName", "text"],
          ["Last Name", "lastName", "text"],
          ["Email", "email", "email"],
        ].map(([label, name, type]) => (
          <div className="mb-3" key={name}>
            <label className="block text-zinc-700 text-sm font-medium mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full py-1 px-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        ))}

        {/* Bio */}
        <div className="mb-3">
          <label className="block text-zinc-700 text-sm font-medium mb-1">
            Bio (Optional)
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full py-1 px-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Tell us a little about yourself..."
          />
        </div>

        {/* Profile Picture */}
        <div className="mb-4">
          <label className="block text-zinc-700 text-sm font-medium mb-1">
            Profile Picture URL (Optional)
          </label>
          <input
            type="url"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            className="w-full py-1 px-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://example.com/your-photo.jpg"
          />
        </div>

        <button
          type="submit"
          className={`bg-emerald-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-700"
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
