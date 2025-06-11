import { screen } from "@testing-library/react";
import Home from "./Home";
import { renderWithRouter, testUser1 } from "../test-helpers/_testCommons";

// mock img on home page
vi.mock("../assets/home.jpg", () => ({ default: "home.jpg" }));

describe("Home", () => {
  function renderHome(currentUser = null) {
    return renderWithRouter(<Home currentUser={currentUser} />);
  }

  it("matches snapshot for not logged in user", () => {
    const { asFragment } = renderHome();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for logged in user", () => {
    const { asFragment } = renderHome(testUser1);
    expect(asFragment()).toMatchSnapshot(); 
  });

  it("redirects to /dashboard when user logs in", () => {
    renderHome(testUser1);
    expect(screen.queryByText(/welcome to ourtabi/i)).not.toBeInTheDocument();
  });

  it("renders welcome msg and correct buttons when the user is not logged in", () => {
    renderHome();

    expect(
      screen.getByText(/your shared journey begins here/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/welcome to ourtabi/i)).toBeInTheDocument();
    expect(
      screen.getByText(/plan your trips, invite friends/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("renders image and text overlay", () => {
    renderHome();

    const img = screen.getByAltText(/japanese temple/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "home.jpg");

    expect(screen.getByText(/why ourtabi/i)).toBeInTheDocument();
    expect(screen.getByText(/plan group trips easily/i)).toBeInTheDocument();
  });
});
