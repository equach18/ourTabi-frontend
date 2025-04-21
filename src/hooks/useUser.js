import { useContext } from "react";
import UserContext from "../context/UserContext";

/** Custom hook to access UserContext */
function useUser() {
  return useContext(UserContext);
}

export default useUser;
