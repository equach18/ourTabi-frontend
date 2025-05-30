import { screen } from "@testing-library/react";
import TripCard from "./TripCard";
import {
  renderWithAllProviders,
  testTrip,
} from "../../test-helpers/_testCommons";

describe("TripCard", () => {
  it("renders trip title and destination", () => {
    renderWithAllProviders(<TripCard trip={testTrip} />);
    expect(screen.getByText("Test trip")).toBeInTheDocument();
    expect(screen.getByText(/Chicago, IL/)).toBeInTheDocument();
  });

  it("renders formatted date range if present", () => {
    renderWithAllProviders(<TripCard trip={testTrip} />);
    expect(
      screen.getByText(/7\/9\/2025\s*-\s*7\/11\/2025/, { exact: false })
    ).toBeInTheDocument();
  });

  it("shows 'Private' badge if trip is private", () => {
    renderWithAllProviders(<TripCard trip={testTrip} />);
    expect(screen.getByText("Private")).toBeInTheDocument();
  });

  it("does not show date range if startDate or endDate is missing", () => {
    const tripWithoutDates = { ...testTrip, startDate: null, endDate: null };
    renderWithAllProviders(<TripCard trip={tripWithoutDates} />);
    expect(screen.queryByText(/-.*\//)).not.toBeInTheDocument();
  });

  it("links to the correct trip detail page", () => {
    renderWithAllProviders(<TripCard trip={testTrip} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/trips/42");
  });
});
