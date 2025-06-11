import { fireEvent, screen, waitFor } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { renderWithAllProviders } from "../../test-helpers/_testCommons";
import LoginForm from "./LoginForm";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

describe("LoginForm", () => {
  const mockLogin = vi.fn();

  function renderForm() {
    return renderWithAllProviders(
      <Routes>
        <Route path="/login" element={<LoginForm login={mockLogin} />} />
      </Routes>,
      { route: "/login" }
    );
  }

  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it("matches snapshot", () => {
    const { asFragment } = renderForm();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the login form", () => {
    renderForm();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("calls login and navigates to dashboard on success", async () => {
    mockLogin.mockResolvedValue({ success: true });

    renderForm();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error msgs when login fails", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      errors: ["Invalid credentials"],
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "badpw" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
