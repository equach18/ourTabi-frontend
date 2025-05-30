import { screen, fireEvent } from "@testing-library/react";
import FriendCard from "./FriendCard";
import {
  renderWithAllProviders,
  testUser2,
} from "../../test-helpers/_testCommons";

describe("FriendCard component", () => {
  it("renders friend info", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} />);
    expect(screen.getByText("Test2 User2")).toBeInTheDocument();
    expect(screen.getByText("@testUser2")).toBeInTheDocument();
  });

  it("shows accept and decline buttons for incoming requests", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isRequest />);
    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decline/i })
    ).toBeInTheDocument();
  });

  it("shows Cancel button for sent requests", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isSent />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows Add Friend button for search result", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isSearchResult />);
    expect(
      screen.getByRole("button", { name: /add friend/i })
    ).toBeInTheDocument();
  });

  it("shows X button when it is a friend", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} />);
    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
  });

  it("calls acceptRequest when accept is clicked", () => {
    const acceptRequest = vi.fn();
    renderWithAllProviders(<FriendCard friend={testUser2} isRequest />, {
      userContext: { currentUser: testUser2, acceptRequest },
    });

    fireEvent.click(screen.getByRole("button", { name: /accept/i }));
    expect(acceptRequest).toHaveBeenCalledWith(testUser2);
  });

  it("calls removeFriendship when X is clicked", () => {
    const removeFriendship = vi.fn();

    // decline for incoming requests
    renderWithAllProviders(<FriendCard friend={testUser2} isRequest />, {
      userContext: { currentUser: testUser2, removeFriendship },
    });
    fireEvent.click(screen.getByRole("button", { name: /decline/i }));
    expect(removeFriendship).toHaveBeenCalledWith(testUser2);

    // cancel for sent requests
    renderWithAllProviders(<FriendCard friend={testUser2} isSent />, {
      userContext: { currentUser: testUser2, removeFriendship },
    });
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(removeFriendship).toHaveBeenCalledWith(testUser2);

    // x to remove for friends
    renderWithAllProviders(<FriendCard friend={testUser2} />, {
      userContext: { currentUser: testUser2, removeFriendship },
    });
    fireEvent.click(screen.getByRole("button", { name: "X" }));
    expect(removeFriendship).toHaveBeenCalledWith(testUser2);
  });

  it("calls sendRequest when Add Friend is clicked", () => {
    const sendRequest = vi.fn();
    renderWithAllProviders(<FriendCard friend={testUser2} isSearchResult />, {
      userContext: { currentUser: testUser2, sendRequest },
    });
    fireEvent.click(screen.getByRole("button", { name: /add friend/i }));
    expect(sendRequest).toHaveBeenCalledWith(testUser2);
  });
});
