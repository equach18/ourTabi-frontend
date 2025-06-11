import { fireEvent, screen, waitFor } from "@testing-library/react";
import CommentForm from "./CommentForm";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";

describe("CommentForm", () => {
  const mockAddComment = vi.fn();

  beforeEach(() => {
    mockAddComment.mockClear();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithAllProviders(
      <CommentForm addComment={mockAddComment} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders input and button", () => {
    renderWithAllProviders(<CommentForm addComment={mockAddComment} />);
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls addComment with text and clears input on submit", async () => {
    renderWithAllProviders(<CommentForm addComment={mockAddComment} />);

    const input = screen.getByPlaceholderText(/write a comment/i);
    const button = screen.getByRole("button");

    fireEvent.change(input, { target: { value: "test comment" } });
    fireEvent.click(button);

    expect(mockAddComment).toHaveBeenCalledWith("test comment");
    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("does not call addComment if input is empty", () => {
    renderWithAllProviders(<CommentForm addComment={mockAddComment} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockAddComment).not.toHaveBeenCalled();
  });
});
