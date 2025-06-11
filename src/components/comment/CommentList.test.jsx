import { render, screen } from "@testing-library/react";
import CommentList from "./CommentList";

// isolate CommentCard  testing
vi.mock("./CommentCard", () => ({
  default: ({ comment }) => <div>{comment.text}</div>,
}));

describe("CommentList", () => {
  const testComments = [
    { id: 1, text: "comment 1" },
    { id: 2, text: "comment 2" },
  ];

  it("matches snapshot", () => {
    const { asFragment } = render(<CommentList comments={testComments} />);
    expect(asFragment()).toMatchSnapshot();
  });
  
  it("renders a list of comments", () => {
    render(<CommentList comments={testComments} />);

    expect(screen.getByText("comment 1")).toBeInTheDocument();
    expect(screen.getByText("comment 2")).toBeInTheDocument();
  });

  it("renders fallback text when there are no comments to render", () => {
    render(<CommentList comments={[]} />);
    expect(
      screen.getByText(/no comments yet\. start the conversation/i)
    ).toBeInTheDocument();
  });
});
