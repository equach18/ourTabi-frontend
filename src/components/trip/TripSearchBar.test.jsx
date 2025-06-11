import { fireEvent, screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import TripSearchBar from "./TripSearchBar";
import { renderWithRouter } from "../../test-helpers/_testCommons";
// mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearchBar() {
  return renderWithRouter(
    <Routes>
      <Route path="*" element={<TripSearchBar />} />
    </Routes>
  );
}

describe("TripSearchBar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderSearchBar();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders input and button", () => {
    renderSearchBar();

    expect(
      screen.getByPlaceholderText(/search by location or title/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go/i })).toBeInTheDocument();
  });

  it("navigates to correct URL on valid input", () => {
    renderSearchBar();

    const input = screen.getByPlaceholderText(/search by location or title/i);
    fireEvent.change(input, { target: { value: "chicago" } });

    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/search?term=chicago");
  });

  it("does not navigate on empty input", () => {
    renderSearchBar();

    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("clears input after submit", () => {
    renderSearchBar();

    const input = screen.getByPlaceholderText(/search by location or title/i);
    fireEvent.change(input, { target: { value: "Japan" } });

    fireEvent.click(screen.getByRole("button", { name: /go/i }));

    expect(input.value).toBe(""); 
  });
});
