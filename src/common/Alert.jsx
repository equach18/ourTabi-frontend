import React from "react";

/**
 * Presentational component for displaying alerts.
 *
 * Used in: Login, Signup, Profile Forms
 *
 * @param {string} type - "error" (default) or "success"
 * @param {string[]} messages - Array of messages to display
 */

function Alert({ type = "error", messages = [] }) {
  if (!messages.length) return null;

  const alertStyles =
    type === "error"
      ? "bg-red-100 text-red-700 border border-red-400"
      : "bg-green-100 text-green-700 border border-green-400";

  return (
    <div className={`p-3 rounded-lg ${alertStyles} my-2`}>
      {messages.map((msg, idx) => (
        <p className="text-sm" key={idx}>
          {msg}
        </p>
      ))}
    </div>
  );
}

export default Alert;
