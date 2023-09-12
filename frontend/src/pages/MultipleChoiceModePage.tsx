import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import RestartButton from "../components/RestartButton";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { MultipleChoiceModePageTr } from "../translations/pagesTr";
import { ModesTr } from "../translations/miscTr";
import getFontSizeClass from "../utils/getFontSizeClass";
import WordSetContext from "interfaces/WordSetContext.interface";
import "../css/MultipleChoiceModePage.css";

interface AnswerButtonProps {
  answer: string;
  onClick: () => void;
}

const ANSWER_COUNT = 4;

function AnswerButton({ answer, onClick }: AnswerButtonProps) {
  return (
    <button className="answer-button" onClick={onClick}>
      {answer}
    </button>
  );
}

function MultipleChoiceModePage() {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const { records, setCurrentModeId, setAreConfettiEnabled }: WordSetContext =
    useOutletContext();
  const { langCode } = useTr();

  useDocumentTitle(ModesTr["multiple-choice"][langCode]);

  function increaseCurrentRecordIndex() {
    setCurrentRecordIndex(
      (prevCurrentRecordIndex) => prevCurrentRecordIndex + 1
    );
  }

  const fillAnswers = useCallback(() => {
    if (!records) {
      return;
    }

    const terms = records.map((record) => record.term);
    const correctAnswer = terms[currentRecordIndex];
    const incorrectAnswers = [];

    let remainingTerms = terms.filter(
      (_term, index) => index !== currentRecordIndex
    );

    if (remainingTerms.length < ANSWER_COUNT - 1) {
      remainingTerms = [...remainingTerms, "phone", "car", "fast", "eagle"];
    }

    while (incorrectAnswers.length < ANSWER_COUNT - 1) {
      const randIndex = Math.floor(Math.random() * remainingTerms.length);

      incorrectAnswers.push(remainingTerms[randIndex]);
      remainingTerms = remainingTerms.filter(
        (_term, index) => index !== randIndex
      );
    }

    setAnswers([correctAnswer, ...incorrectAnswers].sort());
  }, [records, currentRecordIndex]);

  function checkAnswer(answer: string) {
    const givenAnswer = answer.toLowerCase();
    const correctAnswer = records[currentRecordIndex]?.term.toLowerCase();

    if (givenAnswer === correctAnswer) {
      setResult((prevResult) => prevResult + 1);
    }
  }

  function restart() {
    setCurrentRecordIndex(0);
    setResult(0);
    setIsEnd(false);
    setAreConfettiEnabled(false);
  }

  useEffect(() => {
    setCurrentModeId("multiple-choice");
  }, [setCurrentModeId]);

  useEffect(() => {
    if (isEnd) {
      setAreConfettiEnabled(true);
    }
  }, [isEnd, setAreConfettiEnabled]);

  useEffect(() => {
    if (!records || records.length === 0) {
      return;
    }

    if (currentRecordIndex >= records.length) {
      setIsEnd(true);
    } else {
      fillAnswers();
    }
  }, [currentRecordIndex, records, fillAnswers]);

  const definition = records[currentRecordIndex]?.definition ?? "";
  const definitionFontSizeClass = getFontSizeClass(definition.length);

  const answerButtons = answers.map((answer, index) => (
    <AnswerButton
      key={index}
      answer={answer}
      onClick={() => {
        checkAnswer(answer);
        increaseCurrentRecordIndex();
      }}
    />
  ));

  return (
    <div className="multiple-choice-mode-page">
      {isEnd ? (
        <>
          <h1 className="multiple-choice-mode-page--result">
            {`${MultipleChoiceModePageTr.result[langCode]} ${result}/${
              records?.length || 0
            }`}
          </h1>

          <RestartButton onClick={restart} />
        </>
      ) : (
        <>
          <h1
            className={`multiple-choice-mode-page--definition ${definitionFontSizeClass}`}
          >
            {definition}
          </h1>

          <div className="multiple-choice-mode-page--answers">
            {answerButtons}
          </div>
        </>
      )}
    </div>
  );
}

export default MultipleChoiceModePage;
