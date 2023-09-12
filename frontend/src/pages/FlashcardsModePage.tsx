import { useState, useRef, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import ItemNavigator from "../components/ItemNavigator";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { FlashcardsModePageTr } from "../translations/pagesTr";
import { ModesTr } from "../translations/miscTr";
import WordSetContext from "interfaces/WordSetContext.interface";
import "../css/FlashcardsModePage.css";

interface FlashcardsModePageProps {
  mode: "default" | "flashcards";
}

const CARDS_GAP = 40;

function FlashcardsModePage({ mode }: FlashcardsModePageProps) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const { records, setCurrentModeId }: WordSetContext = useOutletContext();
  const cardsNodeRef = useRef<HTMLDivElement>(null);
  const { langCode } = useTr();

  useDocumentTitle(
    mode === "default"
      ? FlashcardsModePageTr.defaultModeTitle[langCode]
      : ModesTr.flashcards[langCode]
  );

  function decreaseCurrentRecordIndex() {
    setCurrentRecordIndex((prevCurrentRecordIndex) =>
      Math.max(prevCurrentRecordIndex - 1, 0)
    );
  }

  function increaseCurrentRecordIndex() {
    setCurrentRecordIndex((prevCurrentRecordIndex) =>
      Math.min(prevCurrentRecordIndex + 1, records.length - 1)
    );
  }

  const scroll = useCallback(() => {
    const cardsNode = cardsNodeRef.current;

    if (cardsNode) {
      const scrollOffset =
        currentRecordIndex * cardsNode.clientWidth +
        currentRecordIndex * CARDS_GAP;
      cardsNode.scrollLeft = scrollOffset;
    }
  }, [currentRecordIndex]);

  useEffect(() => {
    setCurrentModeId(mode);
  }, [setCurrentModeId, mode]);

  useEffect(() => {
    scroll();
    window.addEventListener("resize", scroll);

    return () => window.removeEventListener("resize", scroll);
  }, [currentRecordIndex, scroll]);

  const recordsCount = records?.length || 0;
  const cards = records?.map((record) => {
    const [frontText, backText] =
      mode === "flashcards"
        ? [record.definition, record.term]
        : [record.term, record.definition];

    return <Card key={record.id} frontText={frontText} backText={backText} />;
  });

  return (
    <div className="flashcards-mode-page">
      <div className="flashcards-mode-page--cards" ref={cardsNodeRef}>
        {cards}
      </div>

      {recordsCount > 1 && (
        <ItemNavigator
          currentItemIndex={currentRecordIndex}
          itemsCount={recordsCount}
          onPrev={decreaseCurrentRecordIndex}
          onNext={increaseCurrentRecordIndex}
        />
      )}
    </div>
  );
}

export default FlashcardsModePage;
