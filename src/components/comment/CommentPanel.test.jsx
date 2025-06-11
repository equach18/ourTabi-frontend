import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import CommentPanel from "./CommentPanel";
import {
  renderWithAllProviders,
  testComment,
  testUser1,
} from "../../test-helpers/_testCommons";
import * as TripContextModule from "../../context/TripContext";

describe("CommentPanel", () => {
  const mockAddComment = vi.fn();

  const tripContextValue = {
    comments: [testComment],
    addComment: mockAddComment,
    members: [
      {
        userId: testUser1.id,
        username: testUser1.username,
        profilePic: testUser1.profilePic,
      },
    ],
  };

  function renderPanel() {
    return renderWithAllProviders(
      <Routes>
        <Route path="/" element={<CommentPanel />} />
      </Routes>,
      {
        tripContext: tripContextValue,
        route: "/",
      }
    );
  }

  beforeEach(() => {
    mockAddComment.mockClear();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderPanel();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders heading and comment list", () => {
    renderPanel();

    expect(screen.getByText(/comments/i)).toBeInTheDocument();
    expect(screen.getByText(testComment.text)).toBeInTheDocument();
  });
});
