import { screen, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import {
  renderWithAllProviders,
  testUser1,
  testTrip,
} from "../test-helpers/_testCommons";

// mock components within dashboard
vi.mock("../components/user/UserProfileSidebar", () => ({
  default: () => <div data-testid="UserProfileSidebar" />,
}));
vi.mock("../components/friend/FriendPanel", () => ({
  default: () => <div data-testid="FriendPanel" />,
}));
vi.mock("../components/trip/TripCard", () => ({
  default: ({ trip }) => <div data-testid="TripCard">{trip.title}</div>,
}));

// mock hooks used
vi.mock("../hooks/useLocalStorage", () => ({
  default: () => [false, vi.fn()],
}));

describe("Dashboard", () => {
  function renderDashboard(trips = []) {
    return renderWithAllProviders(
      <Dashboard currentUser={testUser1} trips={trips} />
    );
  }

  it("matches snapshot", () => {
    const { asFragment } = renderDashboard();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders welcome message if not seen", async () => {
    renderDashboard();

    expect(screen.getByText(/welcome back, testuser1/i)).toBeInTheDocument();

    await waitFor(
      () =>
        expect(
          screen.queryByText(/welcome back, testuser1/i)
        ).not.toBeInTheDocument(),
      { timeout: 3500 }
    );
  });

  it("renders trips when provided", () => {
    renderDashboard([testTrip]);

    expect(screen.getByTestId("TripCard")).toBeInTheDocument();
    expect(screen.getByText("Test trip")).toBeInTheDocument();
  });

  it("displays msg if no trips", () => {
    renderDashboard([]);

    expect(
      screen.getByText(/no trips yet\. start planning now!/i)
    ).toBeInTheDocument();
  });

  it("renders Create a New Trip button", () => {
    renderDashboard();

    expect(
      screen.getByRole("link", { name: /\+ create a new trip/i })
    ).toBeInTheDocument();
  });

  it("renders sidebar and friend panel", () => {
    renderDashboard();

    expect(screen.getByTestId("UserProfileSidebar")).toBeInTheDocument();
    expect(screen.getByTestId("FriendPanel")).toBeInTheDocument();
  });
});
