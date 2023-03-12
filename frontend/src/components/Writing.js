import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import "../css/writingListening.css";
import "../css/writing.css";

export default function Writing(props) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [records, setCurrentModeId, setConfettiAreEnabled] = useOutletContext();
  const inputNodeRef = useRef(null);

  const increaseCurrentRecordIndex = () => {
    setCurrentRecordIndex(
      (prevCurrentRecordIndex) => prevCurrentRecordIndex + 1
    );
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const checkAnswer = (event) => {
    event.preventDefault();

    const givenAnswer = answer.toLowerCase();
    const correctAnswer = records[currentRecordIndex].term.toLowerCase();

    if (givenAnswer === correctAnswer) {
      setAnswer("");
      increaseCurrentRecordIndex();
    } else toggleInProp();
  };

  const restart = () => {
    setConfettiAreEnabled(false);
    setAnswer("");
    setIsEnd(false);
    setCurrentRecordIndex(0);
  };

  const toggleInProp = () => {
    setInProp((prevInProp) => !prevInProp);
  };

  useEffect(() => {
    document.title = "Writing";

    setCurrentModeId(props.mode);
  }, [setCurrentModeId, props.mode]);

  useEffect(() => {
    if (isEnd) setConfettiAreEnabled(true);
  }, [isEnd, setConfettiAreEnabled]);

  useEffect(() => {
    if (records.length === 0) return;

    if (currentRecordIndex >= records.length) setIsEnd(true);
  }, [currentRecordIndex, records]);

  const definition = records[currentRecordIndex]?.definition;

  return (
    <div className="writing">
      {isEnd ? (
        <div className="writing--restart" onClick={restart}>
          Start again
        </div>
      ) : (
        <>
          <h1 className="writing--definition" translate="no">
            {definition}
          </h1>

          <form
            className="writing--form"
            autoComplete="off"
            title=""
            onSubmit={checkAnswer}>
            <CSSTransition
              nodeRef={inputNodeRef}
              in={inProp}
              timeout={1000}
              classNames="writing--form--input">
              <input
                className="writing--form--input"
                placeholder="Type your answer here"
                value={answer}
                ref={inputNodeRef}
                autoFocus={true}
                onChange={handleAnswerChange}
              />
            </CSSTransition>
            <button className="writing--form--send">&rarr;</button>
          </form>

          <div className="writing--skip" onClick={increaseCurrentRecordIndex}>
            Skip
          </div>
        </>
      )}
    </div>
  );
}
