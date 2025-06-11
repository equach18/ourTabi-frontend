import { screen, fireEvent } from "@testing-library/react";
import MemberCard from "./MemberCard";
import {
  renderWithAllProviders,
  testUser1,
} from "../../test-helpers/_testCommons";

describe("MemberCard", () => {
  const testMember = {
    ...testUser1,
    firstName: "Test",
    lastName: "User",
    role: "member",
  };

  it("renders basic member info", () => {
    renderWithAllProviders(<MemberCard member={testMember} />);
    expect(screen.getByText("Test User (member)")).toBeInTheDocument();
    expect(screen.getByText(/@testuser1/i)).toBeInTheDocument();
  });

  it("renders 'owner' label if member is the owner", () => {
    const owner = { ...testMember, role: "owner" };
    renderWithAllProviders(<MemberCard member={owner} />);
    expect(screen.getByText("Test User (owner)")).toBeInTheDocument();
  });

  it("shows Add button if isEditing is true", () => {
    const mockAdd = vi.fn();
    renderWithAllProviders(<MemberCard member={testMember} isEditing />, {
      tripContext: { addMember: mockAdd, removeMember: vi.fn(), members: [] },
    });

    const btn = screen.getByRole("button", { name: /add/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockAdd).toHaveBeenCalledWith(testMember);
  });

  it("shows X button if isTripCreator and not owner", () => {
    const mockRemove = vi.fn();
    renderWithAllProviders(<MemberCard member={testMember} isTripCreator />, {
      tripContext: {
        removeMember: mockRemove,
        addMember: vi.fn(),
        members: [],
      },
    });

    const btn = screen.getByRole("button", { name: /remove member/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(mockRemove).toHaveBeenCalledWith(testMember);
  });

  it("does not show X button for owner", () => {
    const owner = { ...testMember, role: "owner" };
    renderWithAllProviders(<MemberCard member={owner} isTripCreator />, {
      tripContext: { removeMember: vi.fn(), addMember: vi.fn(), members: [] },
    });

    expect(screen.queryByRole("button", { name: "X" })).not.toBeInTheDocument();
  });
});
