import { screen } from "@testing-library/react";
import NavBar from "./NavBar";
import { renderWithAllProviders } from "../test-helpers/_testCommons";

// mock TripSearchBar
vi.mock("../components/trip/TripSearchBar", () => ({
  default: () => <div data-testid="TripSearchBar">Mock SearchBar</div>,
}));

describe("NavBar", () => {
  function renderNavBar({ currentUser = null, logout = vi.fn() } = {}) {
    return renderWithAllProviders(<NavBar />, {
      userContext: { currentUser, logout, friends: [] }, // provide logout and friends just in case
      route: "/",
    });
  }

  it("matches snapshot when logged out", () => {
    const { asFragment } = renderNavBar();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when logged in", () => {
    const { asFragment } = renderNavBar({
      currentUser: { username: "test" },
      logout: vi.fn(),
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders login and signup links when logged out", () => {
    renderNavBar();

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    expect(screen.queryByTestId("TripSearchBar")).not.toBeInTheDocument();
  });

  it("renders logout and search bar when logged in", () => {
    renderNavBar({
      currentUser: { username: "test" },
      logout: vi.fn(),
    });

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByTestId("TripSearchBar")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("calls logout function when logout button is clicked", () => {
    const mockLogout = vi.fn();

    renderNavBar({
      currentUser: { username: "test" },
      logout: mockLogout,
    });

    screen.getByText("Logout").click();
    expect(mockLogout).toHaveBeenCalled();
  });
});
