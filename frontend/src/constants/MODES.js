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
    element: <WritingModePage mode="writing" />,
  },
  {
    id: "listening",
    element: <ListeningModePage mode="listening" />,
  },
  {
    id: "multiple-choice",
    element: <MultipleChoiceModePage mode="multiple-choice" />,
  },
  {
    id: "multiple-match",
    element: <MultipleMatchModePage mode="multiple-match" />,
  },
];

export default MODES;
