import { screen } from "@testing-library/react";
import {
  renderWithAllProviders,
  testActivity,
} from "../../test-helpers/_testCommons";
import ActivityCard from "./ActivityCard";

describe("ActivityCard component", () => {
  it("renders ActivityCard", () => {
    renderWithAllProviders(
      <ActivityCard activity={testActivity} isTripMember={true} />
    );
    expect(screen.getByText("Kayaking")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithAllProviders(
      <ActivityCard activity={testActivity} isTripMember={true} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders location, description, and scheduled time", () => {
    renderWithAllProviders(
      <ActivityCard activity={testActivity} isTripMember={false} />
    );
    expect(screen.getByText("Location:")).toBeInTheDocument();
    expect(screen.getByText("Chicago")).toBeInTheDocument();

    expect(screen.getByText("Description:")).toBeInTheDocument();
    expect(screen.getByText("So much fun")).toBeInTheDocument();

    expect(screen.getByText(/Scheduled:/)).toBeInTheDocument();
  });

  it("does not render edit link or vote buttons if not trip member", () => {
    renderWithAllProviders(
      <ActivityCard activity={testActivity} isTripMember={false} />
    );
    expect(screen.queryByTitle("Edit Activity")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders edit link and vote buttons for trip members", () => {
    renderWithAllProviders(
      <ActivityCard activity={testActivity} isTripMember={true} />
    );
    expect(screen.getByTitle("Edit Activity")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
  });
});
