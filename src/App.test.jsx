import { render } from "@testing-library/react";
import App from "./App";

it("renders correctly and matches snapshot", () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});
