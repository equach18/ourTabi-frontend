import { screen, fireEvent } from "@testing-library/react";
import {
  renderWithAllProviders,
  testComment,
  testUser2,
  defaultMembers,
} from "../../test-helpers/_testCommons";
import CommentCard from "./CommentCard";

describe("CommentCard component", () => {
  it("renders comment text and username", () => {
    renderWithAllProviders(<CommentCard comment={testComment} />);

    expect(screen.getByText("Test comment")).toBeInTheDocument();
    expect(screen.getByText("@testUser1")).toBeInTheDocument();
  });

  it("matches snapshot for comment owner", () => {
    const { asFragment } = renderWithAllProviders(
      <CommentCard comment={testComment} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot for non-comment owner", () => {
    const { asFragment } = renderWithAllProviders(
      <CommentCard comment={testComment} />,
      { userContext: { currentUser: testUser2 } }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders default profile image if the user does not have one", () => {
    renderWithAllProviders(<CommentCard comment={testComment} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("profilePic.jpg")
    );
  });

  it("does not have a delete button for non-owner", () => {
    renderWithAllProviders(<CommentCard comment={testComment} />, {
      userContext: { currentUser: testUser2 },
    });

    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });

  it("has delete button for comment owner", () => {
    renderWithAllProviders(<CommentCard comment={testComment} />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls deleteComment when delete button is clicked", () => {
    const mockDelete = vi.fn();

    renderWithAllProviders(<CommentCard comment={testComment} />, {
      tripContext: { members: defaultMembers, deleteComment: mockDelete },
    });

    const deleteBtn = screen.getByRole("button", { name: /delete comment/i });
    fireEvent.click(deleteBtn);

    expect(mockDelete).toHaveBeenCalledWith(testComment.id);
  });
});
