import { screen } from "@testing-library/react";
import RouteList from "./RouteList";
import {
  renderWithAllProviders,
  testUser1,
  testTrip,
  defaultUserContext,
} from "../test-helpers/_testCommons";

// mock components
vi.mock("../pages/Home", () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock("../components/user/LoginForm", () => ({
  default: () => <div>Login Form</div>,
}));
vi.mock("../components/user/SignupForm", () => ({
  default: () => <div>Signup Form</div>,
}));
vi.mock("../pages/Dashboard", () => ({
  default: () => <div>Dashboard</div>,
}));
vi.mock("../pages/NotFound", () => ({
  default: () => <div>Not Found</div>,
}));

describe("RouteList", () => {
  it("matches snapshot for home route", () => {
    const { asFragment } = renderWithAllProviders(<RouteList />, {
      route: "/",
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for login route", () => {
    const { asFragment } = renderWithAllProviders(<RouteList />, {
      route: "/login",
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for unmatched route", () => {
    const { asFragment } = renderWithAllProviders(<RouteList />, {
      route: "/no-such-route",
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for dashboard when logged in", () => {
    const { asFragment } = renderWithAllProviders(<RouteList />, {
      route: "/dashboard",
      userContext: {
        currentUser: { id: 1, username: "testuser" },
        trips: [],
        isLoading: false,
      },
    });
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders public routes correctly", () => {
    renderWithAllProviders(<RouteList />, {
      route: "/login",
    });
    expect(screen.getByText("Login Form")).toBeInTheDocument();

    renderWithAllProviders(<RouteList />, { route: "/" });
    expect(screen.getByText("Home Page")).toBeInTheDocument();

    renderWithAllProviders(<RouteList />, { route: "/signup" });
    expect(screen.getByText("Signup Form")).toBeInTheDocument();
  });

  it("redirects to login if not logged in on protected routes", () => {
    renderWithAllProviders(<RouteList />, {
      route: "/dashboard",
      userContext: {
        currentUser: null,
        login: vi.fn(),
      },
    });

    expect(screen.getByText("Login Form")).toBeInTheDocument();
  });

  it("shows protected page if logged in", () => {
    const userContext = {
      ...defaultUserContext,
      currentUser: testUser1,
      trips: [testTrip],
      isLoading: false,
    };

    renderWithAllProviders(<RouteList />, {
      route: "/dashboard",
      userContext,
    });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("shows 404 page for unmatched route", () => {
    renderWithAllProviders(<RouteList />, {
      route: "/badRoute",
    });
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});
