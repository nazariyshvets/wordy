import { useState, useEffect, FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import InteractiveAnswerForm from "../components/InteractiveAnswerForm";
import RestartButton from "../components/RestartButton";
import Skip from "../components/Skip";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { ModesTr } from "../translations/miscTr";
import getFontSizeClass from "../utils/getFontSizeClass";
import WordSetContext from "interfaces/WordSetContext.interface";
import "../css/WritingModePage.css";

function WritingModePage() {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [inProp, setInProp] = useState(false);
  const { records, setCurrentModeId, setAreConfettiEnabled }: WordSetContext =
    useOutletContext();
  const { langCode } = useTr();

  useDocumentTitle(ModesTr["writing"][langCode]);

  function increaseCurrentRecordIndex() {
    setCurrentRecordIndex(
      (prevCurrentRecordIndex) => prevCurrentRecordIndex + 1
    );
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const givenAnswer = answer.toLowerCase();
    const correctAnswer = records[currentRecordIndex]?.term.toLowerCase();

    if (givenAnswer === correctAnswer) {
      setAnswer("");
      increaseCurrentRecordIndex();
    } else {
      toggleInProp();
    }
  }

  function restart() {
    setAreConfettiEnabled(false);
    setAnswer("");
    setIsEnd(false);
    setCurrentRecordIndex(0);
  }

  function toggleInProp() {
    setInProp((prevInProp) => !prevInProp);
  }

  useEffect(() => {
    setCurrentModeId("writing");
  }, [setCurrentModeId]);

  useEffect(() => {
    if (isEnd) {
      setAreConfettiEnabled(true);
    }
  }, [isEnd, setAreConfettiEnabled]);

  useEffect(() => {
    if (records && currentRecordIndex >= records.length) {
      setIsEnd(true);
    }
  }, [currentRecordIndex, records]);

  const definition = records[currentRecordIndex]?.definition ?? "";
  const definitionFontSizeClass = getFontSizeClass(definition.length);

  return (
    <div className="writing-mode-page">
      {isEnd ? (
        <RestartButton onClick={restart} />
      ) : (
        <>
          <h1
            className={`writing-mode-page--definition ${definitionFontSizeClass}`}
          >
            {definition}
          </h1>

          <InteractiveAnswerForm
            answer={answer}
            setAnswer={setAnswer}
            inProp={inProp}
            onSubmit={checkAnswer}
          />

          <Skip onClick={increaseCurrentRecordIndex} />
        </>
      )}
    </div>
  );
}

export default WritingModePage;
