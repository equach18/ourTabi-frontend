import React from "react";
import { render } from "@testing-library/react";
import Alert from "./Alert";
describe("Alert component", () => {
  it("renders without crashing", function () {
    render(<Alert />);
  });

  it("matches snapshot for default error alert", function () {
    const messages = ["Something went wrong."];
    const { asFragment } = render(<Alert messages={messages} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for multiple error messages", function () {
    const messages = ["Error 1", "Error 2", "Error 3"];
    const { asFragment } = render(<Alert messages={messages} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot for success alert", function () {
    const messages = ["Action completed successfully."];
    const { asFragment } = render(<Alert type="success" messages={messages} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
