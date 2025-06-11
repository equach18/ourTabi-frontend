import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import NewTripForm from "./NewTripForm";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NewTripForm", () => {
  const mockAddTrip = vi.fn();

  function renderForm() {
    return renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/new"
          element={<NewTripForm addTrip={mockAddTrip} />}
        />
      </Routes>,
      { route: "/trips/new" }
    );
  }

  beforeEach(() => {
    mockAddTrip.mockReset();
    mockNavigate.mockReset();
  });

  it("renders correct form fields", () => {
    renderForm();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/radius/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/private trip/i)).toBeInTheDocument();
  });
  
  it("matches snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });

  it("disables end date if start date is not selected", () => {
    renderForm();
    const endDate = screen.getByLabelText(/end date/i);
    expect(endDate).toBeDisabled();
  });

  it("calls addTrip navigates successful submission", async () => {
    mockAddTrip.mockResolvedValue({
      success: true,
      trip: { id: 99 },
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "test title" },
    });

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: "test destination" },
    });

    fireEvent.change(screen.getByLabelText(/radius/i), {
      target: { value: "14" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create trip/i }));

    await waitFor(() => {
      expect(mockAddTrip).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/trips/99");
    });
  });

  it("displays error if addTrip fails", async () => {
    mockAddTrip.mockResolvedValue({
      success: false,
      error: { message: "Mock API error" },
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Fail Trip" },
    });

    fireEvent.change(screen.getByLabelText(/destination/i), {
      target: { value: "Nowhere" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create trip/i }));

    expect(await screen.findByText(/mock api error/i)).toBeInTheDocument();
  });
});
