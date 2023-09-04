import { useContext } from "react";
import { TrContext } from "../contexts/TrContext";

function useTr() {
  const trContext = useContext(TrContext);

  if (!trContext) {
    throw new Error("useTr must be used within an TrProvider");
  }

  return trContext;
}

export default useTr;
