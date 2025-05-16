import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TripSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  function handleSubmit(evt) {
    evt.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchTerm("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search by location or title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-64 bg-white px-2 py-1 border rounded-md text-sm"
      />
      <button
        type="submit"
        className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm hover:bg-emerald-700"
      >
        Go
      </button>
    </form>
  );
}

export default TripSearchBar;
