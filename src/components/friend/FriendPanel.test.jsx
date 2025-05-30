import { screen, fireEvent } from "@testing-library/react";
import FriendPanel from "./FriendPanel";
import {
  renderWithUserProvider,
  testFriendsData,
} from "../../test-helpers/_testCommons";

describe("FriendPanel", () => {
  it("matches snapshot for default All Friends tab", () => {
    const { asFragment } = renderWithUserProvider(<FriendPanel />, {
      userContext: testFriendsData,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders All Friends tab by default", () => {
    renderWithUserProvider(<FriendPanel />, {
      userContext: testFriendsData,
    });
    expect(screen.getByText("@testUser1")).toBeInTheDocument();
  });

  it("shows incoming requests when Request tab is clicked", () => {
    renderWithUserProvider(<FriendPanel />, {
      userContext: testFriendsData,
    });
    fireEvent.click(screen.getByText(/Requests/i));
    expect(screen.getByText("@testUser2")).toBeInTheDocument();
  });

  it("shows sent requests when Sent tab is clicked", () => {
    renderWithUserProvider(<FriendPanel />, {
      userContext: testFriendsData,
    });
    fireEvent.click(screen.getByText(/Sent/i));
    expect(screen.getByText("@testUser3")).toBeInTheDocument();
  });

  it("shows message when no friends exist", () => {
    const emptyContext = {
      friends: [],
      incomingRequests: [],
      sentRequests: [],
    };

    renderWithUserProvider(<FriendPanel />, { userContext: emptyContext });
    expect(screen.getByText("No friends yet.")).toBeInTheDocument();
  });
});
