import React, { useState, useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";

import useToggle from "../../hooks/useToggle";
import Alert from "../common/Alert";
import Spinner from "../common/Spinner";

/** Login form.
 *
 * Shows form and manages update to state on changes.
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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-blue-500">Login</h1>
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

        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center `}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
