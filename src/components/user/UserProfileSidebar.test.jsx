import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserProfileSidebar from "./UserProfileSidebar";
import {
  renderWithAllProviders,
  testUser1,
} from "../../test-helpers/_testCommons";
import defaultProfilePic from "../../assets/profilePic.jpg";

describe("UserProfileSidebar", () => {
  it("renders nothing if currentUser is null", () => {
    const { container } = renderWithAllProviders(<UserProfileSidebar />, {
      userContext: { currentUser: null },
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders profile info if user exists", () => {
    renderWithAllProviders(<UserProfileSidebar />);

    expect(screen.getByText("testUser1")).toBeInTheDocument();
    expect(screen.getByAltText("User Profile")).toBeInTheDocument();
  });

  it("renders default pic of user does not have one", () => {
    renderWithAllProviders(<UserProfileSidebar />);

    expect(screen.getByAltText("User Profile").src).toContain(
      defaultProfilePic
    );
  });
});
