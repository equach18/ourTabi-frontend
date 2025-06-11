import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Alert from "../common/Alert";

/** Login form.
 *
 * On submission:
 * - Calls login function prop
 * - Redirects to /dashboard route if successful
 */

function LoginForm({ login }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    if (location.state?.alert) {
      setFormErrors([location.state.alert]);
    }
  }, [location.state]);

  /** Handle form submit: */
  async function handleSubmit(evt) {
    evt.preventDefault();
    setFormErrors([]);

    let result = await login(formData);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setFormErrors(
        Array.isArray(result.errors) ? result.errors : ["Login failed."]
      );
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((l) => ({ ...l, [name]: value }));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-r from-stone-300 via-white to-stone-300 px-4">
      <h1 className="text-3xl font-bold text-orange-500 font-heading mb-4">
        Welcome Back
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
      >
        {formErrors.length > 0 && (
          <div className="mb-4">
            <Alert type="error" messages={formErrors} />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-zinc-700 text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full py-1 px-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-zinc-700 text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full py-1 px-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg w-full hover:bg-emerald-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
