import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import NewActivityForm from "./NewActivityForm";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";
// mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
describe("NewActivityForm", () => {
  const mockAddActivity = vi.fn();

  const tripContextValue = {
    addActivity: mockAddActivity,
  };

  function renderForm() {
    return renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId/activities/new"
          element={<NewActivityForm />}
        />
      </Routes>,
      {
        tripContext: tripContextValue,
        route: "/trips/1/activities/new",
      }
    );
  }

  beforeEach(() => {
    mockAddActivity.mockClear();
    mockNavigate.mockClear();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders form inputs", () => {
    renderForm();

    expect(screen.getByLabelText(/activity name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scheduled time/i)).toBeInTheDocument();
  });

  it("calls addActivity when form is submitted", async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/activity name/i), {
      target: { value: "pickleball" },
    });

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "outdoors" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add activity/i }));

    await waitFor(() => {
      expect(mockAddActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "pickleball",
          category: "outdoors",
        })
      );
    });
  });

  it("displays error messages if addActivity fails", async () => {
    mockAddActivity.mockRejectedValue(["a mock error!!"]);
    renderForm();

    fireEvent.change(screen.getByLabelText(/activity name/i), {
      target: { value: "wrong activity" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add activity/i }));

    await waitFor(() => {
      expect(screen.getByText(/a mock error/i)).toBeInTheDocument();
    });
  });

  it("navigate(-1) is called after successful submission", async () => {
    mockAddActivity.mockResolvedValue();
    renderForm();

    fireEvent.change(screen.getByLabelText(/activity name/i), {
      target: { value: "Swimming" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add activity/i }));

    await waitFor(() => {
      expect(mockAddActivity).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(-1); // ✅ This tests navigate(-1)
    });
  });
});
