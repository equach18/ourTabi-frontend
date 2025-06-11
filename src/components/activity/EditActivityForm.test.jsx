import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import EditActivityForm from "./EditActivityForm";
import {
  renderWithAllProviders,
  testActivity,
} from "../../test-helpers/_testCommons";
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditActivityForm", () => {
  const mockEditActivity = vi.fn();
  const mockDeleteActivity = vi.fn();

  const tripContextValue = {
    activities: [testActivity],
    editActivity: mockEditActivity,
    deleteActivity: mockDeleteActivity,
  };

  function renderForm() {
    return renderWithAllProviders(
      <Routes>
        <Route
          path="/trips/:tripId/activities/:activityId/edit"
          element={<EditActivityForm />}
        />
      </Routes>,
      {
        tripContext: tripContextValue,
        route: `/trips/${testActivity.tripId}/activities/${testActivity.id}/edit`,
      }
    );
  }

  beforeEach(() => {
    mockEditActivity.mockClear();
    mockDeleteActivity.mockClear();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders form with pre-filled data", () => {
    renderForm();

    expect(screen.getByLabelText(/activity name/i)).toHaveValue("Kayaking");
    expect(screen.getByLabelText(/location/i)).toHaveValue("Chicago");
    expect(screen.getByLabelText(/description/i)).toHaveValue("So much fun");
  });

  it("editActivity is called when submitted", async () => {
    const { getByLabelText, getByRole } = renderForm();

    fireEvent.change(getByLabelText(/activity name/i), {
      target: { value: "new activity name" },
    });

    fireEvent.click(getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockEditActivity).toHaveBeenCalledWith(
        testActivity.id,
        expect.objectContaining({ name: "new activity name" })
      );
    });
  });

  it("deleteActivity is called when delete button is clicked", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const { getByRole } = renderForm();

    fireEvent.click(getByRole("button", { name: /delete activity/i }));

    await waitFor(() => {
      expect(mockDeleteActivity).toHaveBeenCalledWith(testActivity.id);
    });
  });

  it("navigates to trip detail page after sucessful submission", async () => {
    mockEditActivity.mockResolvedValueOnce();
    renderForm();

    fireEvent.change(screen.getByLabelText(/activity name/i), {
      target: { value: "Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockEditActivity).toHaveBeenCalledWith(
        testActivity.id,
        expect.objectContaining({ name: "Updated" })
      );
      expect(mockNavigate).toHaveBeenCalledWith(`/trips/${testActivity.tripId}`);
    });
  });
});
