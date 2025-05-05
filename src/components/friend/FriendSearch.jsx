import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import OurTabiApi from "../../api/ourTabiApi";
import FriendCard from "./FriendCard";
import Spinner from "../common/Spinner";

function SearchFriends() {
  const { currentUser, friends, incomingRequests, sentRequests, sendRequest } =
    useContext(UserContext);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  /** Handle form submission */
  async function handleSearch(evt) {
    evt.preventDefault();
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const users = await OurTabiApi.searchUsers(query.trim());

      // Filter out current user, friends, sent/incoming requests
      const excludedIds = new Set([
        currentUser.id,
        ...friends.map((f) => f.id),
        ...sentRequests.map((f) => f.id),
        ...incomingRequests.map((f) => f.id),
      ]);

      const filtered = users.filter((u) => !excludedIds.has(u.id));
      setResults(filtered);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username"
          className="flex-1 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {isSearching && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="mt-3 space-y-3">
          {results.map((f) => (
            <FriendCard
              key={f.id}
              friend={f}
              isSearchResult
            />
          ))}
        </div>
      )}

      {!isSearching && results.length === 0 && query && !error && (
        <p className="text-gray-500">No new users found.</p>
      )}
    </div>
  );
}

export default SearchFriends;
