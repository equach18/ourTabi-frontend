import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import OurTabiApi from "../../api/ourTabiApi";
import FriendCard from "./FriendCard";
import Spinner from "../common/Spinner";

function SearchFriends() {
  const { friends, incomingRequests, sentRequests } = useContext(UserContext);

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
      setResults(users);
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

      {results.map((f) => {
        const isFriend = friends.some((fr) => fr.id === f.id);
        const isSent = sentRequests.some((req) => req.id === f.id);
        const isRequest = incomingRequests.some((req) => req.id === f.id);

        return (
          <FriendCard
            key={f.id}
            friend={f}
            isFriend={isFriend}
            isSent={isSent}
            isRequest={isRequest}
          />
        );
      })}

      {!isSearching && results.length === 0 && query && !error && (
        <p className="text-gray-500">No new users found.</p>
      )}
    </div>
  );
}

export default SearchFriends;
