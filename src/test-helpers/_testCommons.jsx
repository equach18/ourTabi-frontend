import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../context/UserContext";
import TripContext from "../context/TripContext";

export const testUser1 = {
  id: 1,
  firstName: "Test1",
  lastName: "User1",
  username: "testUser1",
  profilePic: "",
};
export const testUser2 = {
  id: 2,
  firstName: "Test2",
  lastName: "User2",
  username: "testUser2",
  profilePic: "testUser2.png",
};
export const testUser3 = {
  id: 3,
  firstName: "Test2",
  lastName: "User2",
  username: "testUser3",
  profilePic: "testUser3.png",
};

export const defaultMembers = [
  {
    userId: testUser1.id,
    username: testUser1.username,
    profilePic: testUser1.profilePic,
  },
  {
    userId: testUser2.id,
    username: testUser2.username,
    profilePic: testUser2.profilePic,
  },
];

export const testActivity = {
  id: 1,
  name: "Kayaking",
  tripId: 53,
  category: "Other",
  location: "Chicago",
  description: "So much fun",
  scheduledTime: "2025-07-10T14:30:00Z",
};

export const testComment = {
  id: 1,
  text: "Test comment",
  createdAt: "2025-07-11T14:30:00Z",
  userId: 1,
};

export const testTrip = {
  id: 42,
  title: "Test trip",
  destination: "Chicago, IL",
  startDate: "2025-07-10",
  endDate: "2025-07-12",
  isPrivate: true,
};

export const testFriendsData = {
  friends: [testUser1 ],
  incomingRequests: [testUser2],
  sentRequests: [testUser3],
};

// Default mock context values
const defaultUserContext = { currentUser: testUser1 };
const defaultTripContext = {
  voteOnActivity: vi.fn(),
  votes: {},
  deleteComment: vi.fn(),
  addMember: vi.fn(),
  removeMember: vi.fn(),
  members: defaultMembers,
};

// create mock trip context
export function createMockTripContext(overrides = {}) {
  return {
    voteOnActivity: vi.fn(),
    votes: {},
    deleteComment: vi.fn(),
    members: [],
    addMember: vi.fn(),
    removeMember: vi.fn(),
    ...overrides,
  };
}

/**
 * Renders a component inside MemoryRouter
 */
export function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

/**
 * Renders a component inside MemoryRouter + UserContext + TripContext
 */
export function renderWithAllProviders(
  ui,
  {
    userContext = defaultUserContext,
    tripContext = defaultTripContext,
    route = "/",
  } = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <UserContext.Provider value={userContext}>
        <TripContext.Provider value={tripContext}>{ui}</TripContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
}

/**
 * Renders a component with just UserContext
 */
export function renderWithUserProvider(ui, { userContext } = {}) {
  return render(
    <UserContext.Provider value={userContext}>{ui}</UserContext.Provider>
  );
}
