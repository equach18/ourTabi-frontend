import { useState } from "react";

/**
 * Toogle hook
 *
 * @param {boolean} initialState - false by default
 * @returns {[boolean, function, function, function]} [state, enable, disable, toggle]
 */
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const enable = () => setState(true);
  const disable = () => setState(false);
  const toggle = () => setState((oldValue) => !oldValue);

  return [state, enable, disable, toggle];
}

export default useToggle;
