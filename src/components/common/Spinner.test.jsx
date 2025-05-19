import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";
describe("Spinner component", () => {
  it("renders without crashing", () => {
    render(<Spinner />);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Spinner />);
    expect(asFragment()).toMatchSnapshot();
  });
});
