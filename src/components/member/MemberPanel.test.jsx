import { screen, fireEvent } from "@testing-library/react";
import MemberPanel from "./MemberPanel";
import {
  renderWithAllProviders,
  testUser1,
  testUser2,
  testUser3,
  defaultMembers,
} from "../../test-helpers/_testCommons";

const testUserContext = {
  currentUser: testUser1,
  friends: [
    { ...testUser2, userId: testUser2.id },
    { ...testUser3, userId: testUser3.id },
  ],
  incomingRequests: [],
  sentRequests: [],
};

describe("MemberPanel", () => {
  it("matches snapshot for default", () => {
    const { asFragment } = renderWithAllProviders(
      <MemberPanel isTripCreator={false} members={defaultMembers} />,
      { userContext: testUserContext }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders member list on default", () => {
    renderWithAllProviders(
      <MemberPanel isTripCreator={false} members={defaultMembers} />,
      { userContext: testUserContext }
    );

    expect(screen.getByText("@testUser1")).toBeInTheDocument();
    expect(screen.getByText("@testUser2")).toBeInTheDocument();
  });

  it("shows msg when there are no members", () => {
    renderWithAllProviders(<MemberPanel isTripCreator={false} members={[]} />, {
      userContext: testUserContext,
    });

    expect(screen.getByText(/no members yet/i)).toBeInTheDocument();
  });

  it("Shows eligible friends when add button clicked", () => {
    renderWithAllProviders(
      <MemberPanel isTripCreator={true} members={defaultMembers} />,
      { userContext: testUserContext }
    );

    const addBtn = screen.getByRole("button", {
      name: /show eligible friends/i,
    });
    fireEvent.click(addBtn);

    expect(screen.getByText("@testUser3")).toBeInTheDocument();
  });

  it("Shows msg when there are no eligible friends to add", () => {
    renderWithAllProviders(
      <MemberPanel isTripCreator={true} members={defaultMembers} />,
      {
        userContext: {
          currentUser: testUser1,
          friends: [{ ...testUser2, userId: testUser2.id }],
          incomingRequests: [],
          sentRequests: [],
        },
      }
    );

    const addBtn = screen.getByRole("button", {
      name: /show eligible friends/i,
    });
    fireEvent.click(addBtn);

    expect(screen.getByText(/no eligible friends to add/i)).toBeInTheDocument();
  });
});
