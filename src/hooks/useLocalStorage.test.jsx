import { renderHook, act } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => localStorage.clear());

  it("initializes with localStorage value", () => {
    localStorage.setItem("foo", JSON.stringify("bar"));
    const { result } = renderHook(() => useLocalStorage("foo"));
    expect(result.current[0]).toBe("bar");
  });

  it("initializes with default if nothing in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("newKey", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("updates localStorage when state changes", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => {
      const [, setCount] = result.current;
      setCount(5);
    });

    expect(localStorage.getItem("count")).toBe("5");
  });

  it("removes key if state is set to null", () => {
    const { result } = renderHook(() => useLocalStorage("temp", "value"));
    act(() => result.current[1](null));
    expect(localStorage.getItem("temp")).toBe(null);
  });
});
