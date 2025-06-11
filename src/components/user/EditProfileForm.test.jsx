import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Routes, Route } from "react-router-dom";
import EditProfileForm from "./EditProfileForm";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("EditProfileForm", () => {
  const testUser = {
    firstName: "first",
    lastName: "last",
    email: "first@example.com",
    profilePic: "https://example.com/test.jpg",
    bio: "test bio",
  };

  function renderForm() {
    return renderWithAllProviders(
      <Routes>
        <Route
          path="/profile/edit"
          element={
            <EditProfileForm
              updateUser={mockUpdateUser}
              currentUser={testUser}
            />
          }
        />
      </Routes>,
      { route: "/profile/edit" }
    );
  }
  const mockUpdateUser = vi.fn();

  beforeEach(() => {
    mockUpdateUser.mockReset();
    mockNavigate.mockReset();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders form fields", () => {
    renderForm();

    expect(screen.getByDisplayValue(testUser.firstName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(testUser.lastName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(testUser.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(testUser.profilePic)).toBeInTheDocument();
    expect(screen.getByDisplayValue(testUser.bio)).toBeInTheDocument();
  });

  it("shows error if no changes are made", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText(/no changes made/i)).toBeInTheDocument();
  });

  it("calls updateUser only when fields are changed", async () => {
    mockUpdateUser.mockResolvedValue({ success: true });

    renderForm();
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "new name" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ firstName: "new name" });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error if updateUser fails", async () => {
    mockUpdateUser.mockResolvedValue({
      success: false,
      error: "Update failed",
    });

    renderForm();
    fireEvent.change(screen.getByPlaceholderText(/tell us about yourself/i), {
      target: { value: "New bio" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText(/update failed/i)).toBeInTheDocument();
  });

  it("navigates to dashboard on cancel", () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows loading state while submitting", async () => {
    mockUpdateUser.mockImplementation(
      () => new Promise((res) => setTimeout(() => res({ success: true }), 100))
    );

    renderForm();
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "new last name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});
