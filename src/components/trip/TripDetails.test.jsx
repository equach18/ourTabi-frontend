import { render, screen } from "@testing-library/react";
import TripDetails from "./TripDetails";

describe("TripDetails", () => {
  const testTrip = {
    destination: "Chicago",
    isPrivate: true,
  };

  it("matches snapshot", () => {
    const { asFragment } = render(<TripDetails trip={testTrip} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders destination and privacy", () => {
    render(<TripDetails trip={testTrip} />);
    expect(screen.getByText(/destination:/i)).toBeInTheDocument();
    expect(screen.getByText(/chicago/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy:/i)).toBeInTheDocument();
    expect(screen.getByText(/private/i)).toBeInTheDocument();
  });

  it("does not render dates if startDate is missing", () => {
    render(<TripDetails trip={testTrip} />);
    expect(screen.queryByText(/dates:/i)).not.toBeInTheDocument();
  });
});
