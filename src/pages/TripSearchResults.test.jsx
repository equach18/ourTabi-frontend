import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import TripSearchResults from "./TripSearchResults";
import { renderWithAllProviders } from "../test-helpers/_testCommons";

vi.mock("../components/trip/TripCard", () => ({
  default: ({ trip }) => <div data-testid="TripCard">{trip.title}</div>,
}));

vi.mock("../api/ourTabiApi", () => ({
  default: {
    getPublicTrips: vi.fn(),
  },
}));
import OurTabiApi from "../api/ourTabiApi";

function renderSearchResults(term = "") {
  return renderWithAllProviders(
    <Routes>
      <Route path="/search" element={<TripSearchResults />} />
    </Routes>,
    { route: `/search?term=${term}` }
  );
}

describe("TripSearchResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("matches snapshot when there is no search term", () => {
    const { asFragment } = renderSearchResults("");
    expect(asFragment()).toMatchSnapshot();
  });
  it("displays msg when no trips are found", async () => {
    OurTabiApi.getPublicTrips.mockResolvedValueOnce([]);

    renderSearchResults("sdfdsfjk");

    await waitFor(() =>
      expect(screen.getByText(/No trips found/i)).toBeInTheDocument()
    );
  });

  it("displays trips when results are returned", async () => {
    OurTabiApi.getPublicTrips.mockResolvedValueOnce([
      { id: 1, title: "Paris Getaway" },
      { id: 2, title: "London Trip" },
    ]);

    renderSearchResults("europe");

    await waitFor(() =>
      expect(screen.getAllByTestId("TripCard")).toHaveLength(2)
    );
    expect(screen.getByText("Paris Getaway")).toBeInTheDocument();
    expect(screen.getByText("London Trip")).toBeInTheDocument();
  });

  it("shows the search term in the heading", async () => {
    OurTabiApi.getPublicTrips.mockResolvedValueOnce([]);

    renderSearchResults("japan");

    await waitFor(() =>
      expect(
        screen.getByText(
          (content, node) => node.textContent === "Search results for: japan"
        )
      ).toBeInTheDocument()
    );
  });

  it("calls the API with the correct search term", async () => {
    OurTabiApi.getPublicTrips.mockResolvedValueOnce([]);

    renderSearchResults("beach");

    await waitFor(() => {
      expect(OurTabiApi.getPublicTrips).toHaveBeenCalledWith({
        title: "beach",
      });
    });
  });

  it("handles API errors gracefully", async () => {
    console.error = vi.fn(); // suppress expected error logging
    OurTabiApi.getPublicTrips.mockRejectedValueOnce(new Error("Network error"));

    renderSearchResults("error");

    await waitFor(() => {
      expect(screen.getByText(/No trips found/i)).toBeInTheDocument();
    });
  });
});
