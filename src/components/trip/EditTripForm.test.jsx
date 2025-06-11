import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import EditTripForm from "./EditTripForm";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ tripId: "24" }),
    useNavigate: () => mockNavigate,
  };
});

const testTrip = {
  id: 24,
  title: "Test Trip",
  destination: "Tokyo",
  radius: 25,
  startDate: "2025-07-01",
  endDate: "2025-07-05",
  isPrivate: true,
};

describe("EditTripForm", () => {
  const mockEditTrip = vi.fn();

  function renderForm() {
    return renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId/edit"
          element={<EditTripForm editTrip={mockEditTrip} trips={[testTrip]} />}
        />
      </Routes>,
      { route: "/trips/24/edit" }
    );
  }

  beforeEach(() => {
    mockEditTrip.mockReset();
    mockNavigate.mockReset();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders form with initial trip values", () => {
    renderForm();
    expect(screen.getByDisplayValue("Test Trip")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tokyo")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-07-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-07-05")).toBeInTheDocument();
    expect(screen.getByLabelText(/private trip/i)).toBeChecked();
  });

    it("submits form and navigates on success", async () => {
      mockEditTrip.mockResolvedValue();

      renderForm();
      fireEvent.change(screen.getByLabelText(/destination/i), {
        target: { value: "Osaka" },
      });
      fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockEditTrip).toHaveBeenCalledWith(
          24,
          expect.objectContaining({ destination: "Osaka" })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/trips/24");
      });
    });

    it("shows error msg if submission fail", async () => {
      mockEditTrip.mockRejectedValue(new Error("fail"));

      renderForm();
      fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

      expect(await screen.findByText(/error updating trip/i)).toBeInTheDocument();
    });

    it("navigates to trip page when cancel btn is clicked", () => {
      renderForm();
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
      expect(mockNavigate).toHaveBeenCalledWith("/trips/24");
    });

    it("disables end date if no start date", () => {
      const trip = { ...testTrip, startDate: null, endDate: null };
      renderWithAllProviders(
        <Routes>
          <Route
            path="/trips/:tripId/edit"
            element={<EditTripForm editTrip={mockEditTrip} trips={[trip]} />}
          />
        </Routes>,
        { route: "/trips/24/edit" }
      );

      const endDateInput = screen.getByLabelText(/end date/i);
      expect(endDateInput).toBeDisabled();
    });
});
