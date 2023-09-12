import FlashcardsModePage from "../pages/FlashcardsModePage";
import WritingModePage from "../pages/WritingModePage";
import ListeningModePage from "../pages/ListeningModePage";
import MultipleChoiceModePage from "../pages/MultipleChoiceModePage";
import MultipleMatchModePage from "../pages/MultipleMatchModePage";

const MODES = [
  {
    id: "flashcards",
    element: <FlashcardsModePage mode="flashcards" />,
  },
  {
    id: "writing",
    element: <WritingModePage />,
  },
  {
    id: "listening",
    element: <ListeningModePage />,
  },
  {
    id: "multiple-choice",
    element: <MultipleChoiceModePage />,
  },
  {
    id: "multiple-match",
    element: <MultipleMatchModePage />,
  },
];

export default MODES;
