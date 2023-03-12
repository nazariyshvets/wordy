import React, { useState, useRef, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { MODES } from "../utils/modesData";
import "../css/flashcards.css";
import Card from "./Card";

const CARDS_GAP = 40;

export default function Flashcards(props) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [records, setCurrentModeId] = useOutletContext();
  const cardsNodeRef = useRef(null);

  const decreaseCurrentRecordIndex = () => {
    setCurrentRecordIndex((prevCurrentRecordIndex) =>
      prevCurrentRecordIndex > 0 ? prevCurrentRecordIndex - 1 : 0
    );
  };

  const increaseCurrentRecordIndex = () => {
    setCurrentRecordIndex((prevCurrentRecordIndex) =>
      prevCurrentRecordIndex < records.length - 1
        ? prevCurrentRecordIndex + 1
        : records.length - 1
    );
  };

  const scroll = useCallback(() => {
    let scrollOffset = currentRecordIndex * cardsNodeRef.current.clientWidth;
    scrollOffset += currentRecordIndex > 0 ? currentRecordIndex * CARDS_GAP : 0;
    cardsNodeRef.current.scrollLeft = scrollOffset;
  }, [currentRecordIndex, cardsNodeRef]);

  useEffect(() => {
    document.title = `${
      props.mode === MODES.DEFAULT ? "Learning modes" : "Flashcards"
    }`;

    setCurrentModeId(props.mode);
  }, [setCurrentModeId, props.mode]);

  useEffect(() => {
    scroll();
    window.addEventListener("resize", scroll);

    return () => window.removeEventListener("resize", scroll);
  }, [currentRecordIndex, scroll]);

  const cards = records?.map((record) => {
    let frontText, backText;

    if (props.mode === MODES.FLASHCARDS) {
      frontText = record.definition;
      backText = record.term;
    } else {
      frontText = record.term;
      backText = record.definition;
    }

    return <Card frontText={frontText} backText={backText} key={record.id} />;
  });

  return (
    <div className="flashcards">
      <div className="flashcards--cards" ref={cardsNodeRef}>
        {cards}
      </div>

      <div className="flashcards--arrows">
        <div
          className={`flashcards--arrows--prev ${
            currentRecordIndex === 0 ? "hidden" : ""
          }`}
          onClick={decreaseCurrentRecordIndex}>
          &larr;
        </div>

        {records !== 0 && (
          <div className="flashcards--arrows--current-card" translate="no">{`${
            currentRecordIndex + 1
          }/${records.length}`}</div>
        )}

        <div
          className={`flashcards--arrows--next ${
            currentRecordIndex === records?.length - 1 ? "hidden" : ""
          }`}
          onClick={increaseCurrentRecordIndex}>
          &rarr;
        </div>
      </div>
    </div>
  );
}
