import { screen, waitFor } from "@testing-library/react";
import {
  renderWithAllProviders,
  testTrip,
} from "../test-helpers/_testCommons";
import TripProvider from "./TripProvider";
import TripContext from "./TripContext";
import { Route, Routes } from "react-router-dom";
import { act } from "react";

vi.mock("../api/ourTabiApi", () => ({
  default: {
    getTrip: vi.fn(() =>
      Promise.resolve({
        ...testTrip,
        comments: [],
        members: [],
      })
    ),
    getActivities: vi.fn(() => Promise.resolve([])),
    addActivity: vi.fn((tripId, data) => Promise.resolve({ id: 1, ...data })),
    addComment: vi.fn((tripId, text) => Promise.resolve({ id: 1, text })),
    addTripMember: vi.fn((userId, tripId) => Promise.resolve({ id: 1 })),
    removeTripMember: vi.fn(() => Promise.resolve({ removed: true })),
  },
}));

function TestConsumer() {
  return (
    <TripContext.Consumer>
      {(ctx) => (
        <div>
          <div>TripConsumer</div>
          <div>Activities: {ctx.activities.length}</div>
          <div>Comments: {ctx.comments.length}</div>
          <div>Members: {ctx.members.length}</div>
        </div>
      )}
    </TripContext.Consumer>
  );
}

describe("TripProvider", () => {
  it("loads trip and provides context", async () => {
    renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId"
          element={
            <TripProvider>
              <TestConsumer />
            </TripProvider>
          }
        />
      </Routes>,
      { route: `/trips/${testTrip.id}` }
    );

    expect(await screen.findByText("TripConsumer")).toBeInTheDocument();
    expect(screen.getByText("Activities: 0")).toBeInTheDocument();
    expect(screen.getByText("Comments: 0")).toBeInTheDocument();
    expect(screen.getByText("Members: 0")).toBeInTheDocument();
  });

  it("adds activity through context", async () => {
    let contextData;
    function TestComponent() {
      return (
        <TripContext.Consumer>
          {(ctx) => {
            contextData = ctx;
            return <div>Test Add Activity</div>;
          }}
        </TripContext.Consumer>
      );
    }

    renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId"
          element={
            <TripProvider>
              <TestComponent />
            </TripProvider>
          }
        />
      </Routes>,
      { route: `/trips/${testTrip.id}` }
    );

    expect(await screen.findByText("Test Add Activity")).toBeInTheDocument();

    await act(async () => {
      await contextData.addActivity({ name: "New activity" });
    });

    expect(contextData.activities).toHaveLength(1);
    expect(contextData.activities[0].name).toBe("New activity");
  });

  it("adds comment through context", async () => {
    let contextData;
    function TestComponent() {
      return (
        <TripContext.Consumer>
          {(ctx) => {
            contextData = ctx;
            return <div>Test Add Comment</div>;
          }}
        </TripContext.Consumer>
      );
    }

    renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId"
          element={
            <TripProvider>
              <TestComponent />
            </TripProvider>
          }
        />
      </Routes>,
      { route: `/trips/${testTrip.id}` }
    );

    expect(await screen.findByText("Test Add Comment")).toBeInTheDocument();

    await act(async () => {
      await contextData.addComment("commentttt");
    });

    expect(contextData.comments).toHaveLength(1);
    expect(contextData.comments[0].text).toBe("commentttt");
  });

  it("adds and removes member through context", async () => {
    let contextData;
    function TestComponent() {
      return (
        <TripContext.Consumer>
          {(ctx) => {
            contextData = ctx;
            return <div>Test Member Update</div>;
          }}
        </TripContext.Consumer>
      );
    }

    const testFriend = {
      userId: 385,
      username: "tester",
      firstName: "first",
      profilePic: "aPic.png",
    };

    renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId"
          element={
            <TripProvider>
              <TestComponent />
            </TripProvider>
          }
        />
      </Routes>,
      { route: `/trips/${testTrip.id}` }
    );

    expect(await screen.findByText("Test Member Update")).toBeInTheDocument();

    await act(async () => {
      await contextData.addMember(testFriend);
    });
    expect(contextData.members).toHaveLength(1);
    expect(contextData.members[0].username).toBe("tester");

    await act(async () => {
      await contextData.removeMember(contextData.members[0]);
    });
    expect(contextData.members).toHaveLength(0);
  });
});
