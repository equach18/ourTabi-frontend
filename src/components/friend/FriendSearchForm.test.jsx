import { screen, fireEvent } from "@testing-library/react";
import FriendSearchForm from "./FriendSearchForm";
import OurTabiApi from "../../api/ourTabiApi";
import {
  renderWithUserProvider,
  testUser1,
  testUser2,
  testUser3,
  testFriendsData,
} from "../../test-helpers/_testCommons";

vi.mock("../../api/ourTabiApi");

const testUserContext = {
  currentUser: testUser1,
  ...testFriendsData,
};

describe("FriendSearchForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("matches snapshot for default empty state", () => {
    const { asFragment } = renderWithUserProvider(<FriendSearchForm />, {
      userContext: testUserContext,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot while searching", () => {
    const pendingPromise = new Promise(() => {});
    OurTabiApi.searchUsers.mockReturnValueOnce(pendingPromise);

    const { asFragment } = renderWithUserProvider(<FriendSearchForm />, {
      userContext: testUserContext,
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "waiting" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders with input and button", () => {
    renderWithUserProvider(<FriendSearchForm />, {
      userContext: testUserContext,
    });

    expect(
      screen.getByPlaceholderText(/search by username/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("displays an error message", async () => {
    OurTabiApi.searchUsers.mockRejectedValue(new Error("An error!!"));

    renderWithUserProvider(<FriendSearchForm />, {
      userContext: testUserContext,
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "fail" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();
  });

  it("displays matching users", async () => {
    OurTabiApi.searchUsers.mockResolvedValue([testUser2, testUser3]);

    renderWithUserProvider(<FriendSearchForm />, {
      userContext: testUserContext,
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("@testUser2")).toBeInTheDocument();
    expect(await screen.findByText("@testUser3")).toBeInTheDocument();
  });

  it("displays message when no users are found", async () => {
    OurTabiApi.searchUsers.mockResolvedValue([]);

    renderWithUserProvider(<FriendSearchForm />, {
      userContext: testUserContext,
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "no match" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(/no new users found/i)).toBeInTheDocument();
  });
});
