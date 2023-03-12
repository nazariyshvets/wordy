import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import "../css/multipleChoice.css";

export default function MultipleChoice(props) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [records, setCurrentModeId, setConfettiAreEnabled] = useOutletContext();

  const increaseCurrentRecordIndex = () => {
    setCurrentRecordIndex(
      (prevCurrentRecordIndex) => prevCurrentRecordIndex + 1
    );
  };

  const fillAnswers = useCallback(() => {
    let terms = records.map((record) => record.term);
    const correctAnswer = terms[currentRecordIndex];
    const incorrectAnswers = [];

    terms = terms.filter((term, index) => index !== currentRecordIndex);

    if (records.length <= 3)
      terms = [...terms, "phone", "car", "fast", "eagle"];

    while (true) {
      const randIndex = Math.floor(Math.random() * terms.length);

      incorrectAnswers.push(terms[randIndex]);
      terms = terms.filter((term, index) => index !== randIndex);

      if (incorrectAnswers.length >= 3) break;
    }

    setAnswers([correctAnswer, ...incorrectAnswers].sort());
  }, [records, currentRecordIndex]);

  const checkAnswer = (answer) => {
    const givenAnswer = answer.toLowerCase();
    const correctAnswer = records[currentRecordIndex].term.toLowerCase();

    if (givenAnswer === correctAnswer)
      setResult((prevResult) => prevResult + 1);

    increaseCurrentRecordIndex();
  };

  const restart = () => {
    setConfettiAreEnabled(false);
    setIsEnd(false);
    setResult(0);
    setCurrentRecordIndex(0);
  };

  useEffect(() => {
    document.title = "Multiple choice";

    setCurrentModeId(props.mode);
  }, [setCurrentModeId, props.mode]);

  useEffect(() => {
    if (isEnd) setConfettiAreEnabled(true);
  }, [isEnd, setConfettiAreEnabled]);

  useEffect(() => {
    if (records.length === 0) return;

    if (currentRecordIndex >= records.length) setIsEnd(true);
    else fillAnswers();
  }, [currentRecordIndex, records, fillAnswers]);

  const definition = records[currentRecordIndex]?.definition;

  const answerButtons = answers?.map((answer) => (
    <button
      className="multiple-choice--answers--answer"
      key={answer}
      onClick={() => checkAnswer(answer)}>
      {answer}
    </button>
  ));

  return (
    <div className="multiple-choice">
      {isEnd ? (
        <>
          <h1 className="multiple-choice--result">
            Your result is {`${result}/${records.length}`}
          </h1>
          <div className="multiple-choice--restart" onClick={restart}>
            Start again
          </div>
        </>
      ) : (
        <>
          <h1 className="multiple-choice--definition" translate="no">
            {definition}
          </h1>
          <div className="multiple-choice--answers" translate="no">
            {answerButtons}
          </div>
        </>
      )}
    </div>
  );
}
