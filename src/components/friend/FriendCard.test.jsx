import { screen, fireEvent } from "@testing-library/react";
import FriendCard from "./FriendCard";
import {
  renderWithAllProviders,
  testUser2,
} from "../../test-helpers/_testCommons";

describe("FriendCard", () => {
  it("renders friend info", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} />);
    expect(screen.getByText("Test2 User2")).toBeInTheDocument();
    expect(screen.getByText("@testUser2")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("testUser2.png"));
  });

  it("shows accept and decline buttons for incoming requests", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isRequest />);
    expect(screen.getByLabelText("accept")).toBeInTheDocument();
    expect(screen.getByLabelText("decline")).toBeInTheDocument();
  });

  it("shows Cancel button for sent requests", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isSent />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows Add Friend button for search result", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isSearchResult />);
    expect(
      screen.getByRole("button", { name: /add/i })
    ).toBeInTheDocument();
  });

  it("shows X button when it is a friend", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} isFriend />);
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

  it("calls removeFriendship when decline, cancel, or X is clicked", () => {
    const removeFriendship = vi.fn();

    // Decline (incoming request)
    renderWithAllProviders(<FriendCard friend={testUser2} isRequest />, {
      userContext: { currentUser: testUser2, removeFriendship },
    });
    fireEvent.click(screen.getAllByRole("button")[1]); // Decline is second
    expect(removeFriendship).toHaveBeenCalledWith(testUser2);

    // Cancel (sent request)
    renderWithAllProviders(<FriendCard friend={testUser2} isSent />, {
      userContext: { currentUser: testUser2, removeFriendship },
    });
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(removeFriendship).toHaveBeenCalledWith(testUser2);

    // X (isFriend)
    renderWithAllProviders(<FriendCard friend={testUser2} isFriend />, {
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
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(sendRequest).toHaveBeenCalledWith(testUser2);
  });

  it("doesn't render any buttons if no flags are passed", () => {
    renderWithAllProviders(<FriendCard friend={testUser2} />);
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });
});
