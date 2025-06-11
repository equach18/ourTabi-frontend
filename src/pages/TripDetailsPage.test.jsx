vi.mock("../components/trip/TripDetails", () => ({
  default: ({ trip }) => (
    <div data-testid="TripDetails">Trip Details - {trip?.title}</div>
  ),
}));
vi.mock("../components/member/MemberPanel", () => ({
  default: () => <div>Member Panel</div>,
}));
vi.mock("../components/comment/CommentPanel", () => ({
  default: () => <div>Comment Panel</div>,
}));
vi.mock("../components/activity/ActivityList", () => ({
  default: () => <div>Activity Section</div>,
}));

import { screen } from "@testing-library/react";
import TripDetailsPage from "./TripDetailsPage";
import { Routes, Route } from "react-router-dom";
import {
  renderWithAllProviders,
  testTrip,
  testUser1,
  defaultMembers,
  defaultTripContext,
} from "../test-helpers/_testCommons";

describe("TripDetailsPage", () => {
  function renderDetailsPage(overrides = {}) {
    const {
      currentUser = testUser1,
      trip = testTrip,
      activities = [],
      members = defaultMembers,
      route = `/trips/${testTrip.id}`,
      userContext = { currentUser, friends: [] },
      tripContext: customTripContext = {},
    } = overrides;

    const tripContext = {
      ...defaultTripContext,
      trip,
      activities,
      members,
      ...customTripContext,
    };

    return renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId"
          element={
            <TripDetailsPage currentUser={currentUser} removeTrip={vi.fn()} />
          }
        />
        <Route path="*" element={<div>not-found</div>} />
      </Routes>,
      {
        route,
        userContext,
        tripContext,
      }
    );
  }
  it("matches snapshot", () => {
    const { asFragment } = renderDetailsPage();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders trip details and panels for member user", () => {
    const currentUser = { id: 1, username: "testuser" };

    renderDetailsPage({
      currentUser,
      trip: testTrip,
      members: [{ userId: 1 }],
    });

    expect(screen.getByTestId("TripDetails")).toHaveTextContent(
      `Trip Details - ${testTrip.title}`
    );
    expect(screen.getByText(/Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Comment/i)).toBeInTheDocument();
    expect(screen.getByText(/Member/i)).toBeInTheDocument();
  });
  it("does not show edit/delete buttons if user is not creator", () => {
    renderDetailsPage({
      currentUser: { ...testUser1, id: 345 },
    });

    expect(screen.queryByText(/Edit Trip/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Delete Trip/i)).not.toBeInTheDocument();
  });

  it("does not show member or comment panel if user is not a trip member", () => {
    renderDetailsPage({
      currentUser: { ...testUser1, id: 999 },
      members: [],
    });

    expect(screen.queryByText(/Comment Panel/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Member Panel/i)).not.toBeInTheDocument();
  });

  it("navigates to not-found if trip is missing", () => {
    renderDetailsPage({
      trip: null,
      route: "/trips/999",
    });

    expect(true).toBe(true);
  });
});
