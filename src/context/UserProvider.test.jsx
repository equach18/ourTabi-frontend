import { screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../test-helpers/_testCommons";
import UserContext from "./UserContext";
import UserProvider from "./UserProvider";
import { Route, Routes } from "react-router-dom";
import { act } from "react";

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(() => ({ username: "testUser1" })),
}));

vi.mock("../api/ourTabiApi", () => ({
  default: {
    setToken: vi.fn(),
    getUser: vi.fn(() =>
      Promise.resolve({
        username: "testUser1",
        firstName: "Test",
        lastName: "User",
        friends: [],
        incomingRequests: [],
        sentRequests: [],
        trips: [],
      })
    ),
    login: vi.fn(() => Promise.resolve("mock.token")),
    signup: vi.fn(() => Promise.resolve("mock.token")),
    updateUser: vi.fn(() => Promise.resolve({ firstName: "Updated" })),
    createTrip: vi.fn(() =>
      Promise.resolve({ id: 1, title: "New Trip", destination: "Paris" })
    ),
    updateTrip: vi.fn(() =>
      Promise.resolve({ id: 1, title: "Edited Trip", destination: "London" })
    ),
    deleteTrip: vi.fn(() => Promise.resolve({ removed: true })),
  },
}));

function TestConsumer() {
  return (
    <UserContext.Consumer>
      {(ctx) =>
        ctx.currentUser ? (
          <div>Logged in as {ctx.currentUser.username}</div>
        ) : (
          <div>No user</div>
        )
      }
    </UserContext.Consumer>
  );
}

describe("UserProvider", () => {
  it("loads user with token and provides context", async () => {
    localStorage.setItem("token", JSON.stringify("mock.token"));

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              <TestConsumer />
            </UserProvider>
          }
        />
      </Routes>
    );

    expect(
      await screen.findByText("Logged in as testUser1")
    ).toBeInTheDocument();
  });

  it("updates user using updateUser function", async () => {
    let contextData;
    function TestComponent() {
      return (
        <UserContext.Consumer>
          {(ctx) => {
            contextData = ctx;
            return <div>Update test</div>;
          }}
        </UserContext.Consumer>
      );
    }

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              <TestComponent />
            </UserProvider>
          }
        />
      </Routes>
    );

    await screen.findByText("Update test");

    const result = await act(async () =>
      contextData.updateUser({ firstName: "Updated" })
    );

    expect(result.success).toBe(true);
    expect(contextData.currentUser.firstName).toBe("Updated");
  });

  it("adds a new trip via addTrip", async () => {
    let contextData;
    function TestComponent() {
      return (
        <UserContext.Consumer>
          {(ctx) => {
            contextData = ctx;
            return <div>Trip Add Test</div>;
          }}
        </UserContext.Consumer>
      );
    }

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              <TestComponent />
            </UserProvider>
          }
        />
      </Routes>
    );

    await screen.findByText("Trip Add Test");

    await act(async () => {
      await contextData.addTrip({ title: "New Trip", destination: "Paris" });
    });

    expect(contextData.trips).toHaveLength(1);
    expect(contextData.trips[0].title).toBe("New Trip");
  });

  it("removes trip via removeTrip", async () => {
    let contextData;
    function TestComponent() {
      return (
        <UserContext.Consumer>
          {(ctx) => {
            contextData = ctx;
            return <div>Trip Remove Test</div>;
          }}
        </UserContext.Consumer>
      );
    }

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              <TestComponent />
            </UserProvider>
          }
        />
      </Routes>
    );

    await screen.findByText("Trip Remove Test");

    // Add manually first
    await act(async () => {
      await contextData.addTrip({ title: "To Remove", destination: "Nowhere" });
    });
    expect(contextData.trips).toHaveLength(1);

    // Remove it
    await act(async () => {
      await contextData.removeTrip(1);
    });

    expect(contextData.trips).toHaveLength(0);
  });
});
