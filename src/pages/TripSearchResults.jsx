import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OurTabiApi from "../api/ourTabiApi";
import TripCard from "../components/trip/TripCard";

function TripSearchResults() {
  const [searchParams] = useSearchParams();
  const term = searchParams.get("term") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchResults() {
      try {
        const trips = await OurTabiApi.getPublicTrips({ title: term });
        setResults(trips);
      } catch (err) {
        console.error("Search error:", err);
      }
    }
    if (term) fetchResults();
  }, [term]);

  return (
    <div className="h-[calc(100vh-4rem)] px-50 py-12">
      <h2 className="text-xl font-semibold mb-4">
        Search results for: <span className="text-blue-600">{term}</span>
      </h2>
      {results.length > 0 ? (
        results.map((trip) => (
          <div key={trip.id} className="mb-4">
            <TripCard trip={trip} />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No trips found.</p>
      )}
    </div>
  );
}

export default TripSearchResults;
