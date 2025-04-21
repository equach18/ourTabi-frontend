import { useState, useEffect } from "react";
/**
 * Custom hook to manage LocalStorage
 * @param {string} key - Key in localStorage
 * @param {*} initialValue - If there is nothing initially in the state, then set to null.
 */

function useLocalStorage(key, initialValue = null) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (err) {
      console.error("LocalStorage Reading Error:", err);
      return initialValue;
    }
  });
  //   update the localStorage whenever the state or key changes
  useEffect(() => {
    try {
      if (state === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (err) {
      console.error("LocalStorage Write Error:", err);
    }
  }, [key, state]);
  return [state, setState];
}
export default useLocalStorage;
