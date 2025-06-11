import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "./SignupForm";
import { Routes, Route } from "react-router-dom";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SignupForm", () => {
  const mockSignup = vi.fn();

  function renderForm(signupFn = mockSignup) {
    return renderWithAllProviders(
      <Routes>
        <Route
          path="/signup"
          element={<SignupForm signup={signupFn} />}
        />
      </Routes>,
      { route: "/signup" }
    );
  }
  beforeEach(() => {
    mockNavigate.mockReset();
    mockSignup.mockReset();
  });

  it("renders all required fields", () => {
    const successfulSignup = vi.fn().mockResolvedValue({ success: true });
    renderForm(successfulSignup);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });
  it("submits form and redirects when successfully submitted", async () => {
    const mockSignup = vi.fn().mockResolvedValue({ success: true });
    renderForm(mockSignup);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "newuser",
          password: "password123",
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

    it("displays error if signup fails", async () => {
      const badSignup = vi.fn().mockResolvedValue({
        success: false,
        errors: ["Username already taken"],
      });
      renderForm(badSignup);

      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "newuser" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: "User" },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

      await waitFor(() => {
        expect(screen.getByText(/username already taken/i)).toBeInTheDocument();
      });
    });

    it("disables the button and shows spinner when loading", async () => {
      const mockSignup = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((res) => setTimeout(() => res({ success: true }), 500))
        );
      renderForm(mockSignup);

      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: "loadinguser" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "pass123" },
      });
      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: "Loading" },
      });
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: "User" },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "load@example.com" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

      expect(screen.getByRole("button")).toBeDisabled();
      expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed");
    });
});
