// CommentForm.jsx
import { useState } from "react";

function CommentForm({ addComment }) {
  const [text, setText] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await addComment(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-2 border rounded-lg text-sm"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}

export default CommentForm;
