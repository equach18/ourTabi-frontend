import { screen, fireEvent } from "@testing-library/react";
import ActivityVoteButtons from "./ActivityVoteButtons";
import {
  renderWithAllProviders,
  createMockTripContext,
} from "../../test-helpers/_testCommons";

describe("ActivityVoteButtons", () => {
  const activityId = 345;
  let mockVote;

  beforeEach(() => {
    mockVote = vi.fn();
  });

  it("renders vote counts", () => {
    const votes = {
      [activityId]: [
        { userId: 1, voteValue: 1 },
        { userId: 2, voteValue: -1 },
      ],
    };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ votes }),
    });

    const buttons = screen.getAllByRole("button");
    expect(buttons[0].textContent).toContain("1");
    expect(buttons[1].textContent).toContain("1");
  });

  it("upvote button is highlighted when user upvotes", () => {
    const votes = { [activityId]: [{ userId: 1, voteValue: 1 }] };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ votes }),
    });

    const upvoteBtn = screen.getAllByRole("button")[0];
    expect(upvoteBtn.className).toContain("bg-blue-500");
  });

  it("downvote button is highlighted if user downvotes", () => {
    const votes = { [activityId]: [{ userId: 1, voteValue: -1 }] };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ votes }),
    });

    const downvoteBtn = screen.getAllByRole("button")[1];
    expect(downvoteBtn.className).toContain("bg-red-500");
  });

  it("voteOnActivity is called when upvoted", () => {
    const votes = { [activityId]: [] };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ voteOnActivity: mockVote, votes }),
    });

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockVote).toHaveBeenCalledWith(activityId, 1);
  });

  it("removes vote when clicking the same upvote vote button", () => {
    const votes = { [activityId]: [{ userId: 1, voteValue: 1 }] };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ voteOnActivity: mockVote, votes }),
    });

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockVote).toHaveBeenCalledWith(activityId, 0);
  });

  it("voteOnActivity is called when downvote is clicked", () => {
    const votes = { [activityId]: [] };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ voteOnActivity: mockVote, votes }),
    });

    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(mockVote).toHaveBeenCalledWith(activityId, -1);
  });

  it("removes vote when clicking the same downvote again", () => {
    const votes = { [activityId]: [{ userId: 1, voteValue: -1 }] };

    renderWithAllProviders(<ActivityVoteButtons activityId={activityId} />, {
      tripContext: createMockTripContext({ voteOnActivity: mockVote, votes }),
    });

    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(mockVote).toHaveBeenCalledWith(activityId, 0);
  });
});
