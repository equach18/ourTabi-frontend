import { screen } from "@testing-library/react";
import NotFound from "./NotFound";
import { renderWithRouter } from "../test-helpers/_testCommons";

describe("NotFound", () => {
  it("renders 404 page", () => {
    renderWithRouter(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders error msg", () => {
    renderWithRouter(<NotFound />);
    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it("renders link to go back home", () => {
    renderWithRouter(<NotFound />);
    const link = screen.getByRole("link", { name: /go back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
