import Flashcards from "../components/Flashcards";
import Writing from "../components/Writing";
import Listening from "../components/Listening";
import MultipleChoice from "../components/MultipleChoice";
import MultipleMatch from "../components/MultipleMatch";

export const MODES = {
  DEFAULT: "default",
  FLASHCARDS: "flashcards",
  WRITING: "writing",
  LISTENING: "listening",
  MULTIPLE_CHOICE: "multiple-choice",
  MULTIPLE_MATCH: "multiple-match",
  CREATION: "creation",
  UPDATING: "updating",
};

const modesData = [
  {
    title: "Flashcards",
    id: MODES.FLASHCARDS,
    element: <Flashcards mode={MODES.FLASHCARDS} />,
  },
  {
    title: "Writing",
    id: MODES.WRITING,
    element: <Writing mode={MODES.WRITING} />,
  },
  {
    title: "Listening",
    id: MODES.LISTENING,
    element: <Listening mode={MODES.LISTENING} />,
  },
  {
    title: "Multiple Choice",
    id: MODES.MULTIPLE_CHOICE,
    element: <MultipleChoice mode={MODES.MULTIPLE_CHOICE} />,
  },
  {
    title: "Multiple Match",
    id: MODES.MULTIPLE_MATCH,
    element: <MultipleMatch mode={MODES.MULTIPLE_MATCH} />,
  },
];

export default modesData;
