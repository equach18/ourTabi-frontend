import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { renderWithAllProviders } from "../test-helpers/_testCommons";

// mock Spinner
vi.mock("../components/common/Spinner", () => ({
  default: () => <div>Loading Spinner...</div>,
}));

describe("PrivateRoute", () => {
  function renderPrivateRoute({
    currentUser = null,
    isLoading = false,
    route = "/",
  } = {}) {
    return renderWithAllProviders(
      <Routes>
        <Route
          element={
            <PrivateRoute currentUser={currentUser} isLoading={isLoading} />
          }
        >
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        route,
        userContext: { currentUser },
      }
    );
  }
  
  it("matches snapshot when loading", () => {
    const { asFragment } = renderPrivateRoute({ isLoading: true });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when authenticated", () => {
    const { asFragment } = renderPrivateRoute({
      currentUser: { username: "elaine" },
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when unauthenticated", () => {
    const { asFragment } = renderPrivateRoute();
    expect(asFragment()).toMatchSnapshot();
  });
  it("shows spinner when loading", () => {
    renderPrivateRoute({ isLoading: true });
    expect(screen.getByText("Loading Spinner...")).toBeInTheDocument();
  });

  it("renders protected content when user is logged in", () => {
    renderPrivateRoute({ currentUser: { username: "elaine" } });
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when user is not logged in", () => {
    renderPrivateRoute();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
