import { screen } from "@testing-library/react";
import ActivityList from "./ActivityList";
import {
  renderWithAllProviders,
  testActivity,
  testTrip,
  defaultTripContext,
  testUser3,
} from "../../test-helpers/_testCommons";

describe("ActivityList", () => {
  function renderList({ trip, activities }) {
    return renderWithAllProviders(
      <ActivityList activities={activities} trip={trip} />,
      { userContext: { currentUser } }
    );
  }

  it("matches snapshot for trip with no members", () => {
    const { asFragment } = renderWithAllProviders(
      <ActivityList activities={[testActivity]} trip={testTrip} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for trip with members", () => {
    const { asFragment } = renderWithAllProviders(
      <ActivityList activities={[testActivity]} trip={defaultTripContext} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows add activity btn if user is a member", () => {
    renderWithAllProviders(
      <ActivityList activities={[testActivity]} trip={defaultTripContext} />
    );
    expect(
      screen.getByRole("link", { name: /add activity/i })
    ).toBeInTheDocument();
  });

  it("does not show add activity btn if user is not a member", () => {
    renderWithAllProviders(
      <ActivityList activities={[testActivity]} trip={defaultTripContext} />,
      { userContext: { currentUser: testUser3 } }
    );
    expect(
      screen.queryByRole("link", { name: /add activity/i })
    ).not.toBeInTheDocument();
  });

  it("displays activity info when there is an activity", () => {
    renderWithAllProviders(
      <ActivityList activities={[testActivity]} trip={defaultTripContext} />
    );
    expect(screen.getByText(testActivity.name)).toBeInTheDocument();
  });

  it("displays 'No activities yet' msg there aren't any activities", () => {
    renderWithAllProviders(
      <ActivityList activities={[]} trip={defaultTripContext} />
    );
    expect(screen.getByText(/no activities yet/i)).toBeInTheDocument();
  });
});
