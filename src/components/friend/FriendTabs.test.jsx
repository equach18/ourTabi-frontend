import { render, screen, fireEvent } from "@testing-library/react";
import FriendTabs from "./FriendTabs";

describe("FriendTabs", () => {
  const setup = (activeTab = "all") => {
    const mockSetActiveTab = vi.fn();
    render(
      <FriendTabs
        activeTab={activeTab}
        setActiveTab={mockSetActiveTab}
        requestCount={2}
        sentCount={1}
      />
    );
    return mockSetActiveTab;
  };

  it("renders all tab buttons with correct labels", () => {
    setup();
    expect(screen.getByText("All Friends")).toBeInTheDocument();
    expect(screen.getByText("Requests (2)")).toBeInTheDocument();
    expect(screen.getByText("Sent (1)")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("active tab is highlighted", () => {
    setup("requests");
    const activeBtn = screen.getByText("Requests (2)");
    expect(activeBtn.className).toContain("bg-blue-500");
    expect(activeBtn.className).toContain("text-white");
  });

  it("calls setActiveTab with the correct key on click", () => {
    const mockSetActiveTab = setup();
    fireEvent.click(screen.getByText("Sent (1)"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("sent");
  });
});
