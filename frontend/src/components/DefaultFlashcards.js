import React from "react";
import Flashcards from "./Flashcards";
import { MODES } from "../utils/modesData";

// This component is used in order to fully re-render Flashcards component
export default function DefaultFlashcards() {
  return <Flashcards mode={MODES.DEFAULT} />;
}
