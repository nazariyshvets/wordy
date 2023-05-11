import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useSpeechSynthesis } from "react-speech-kit";
import useAxios from "../utils/useAxios";
import detectBrowser from "../utils/detectBrowser";
import "../css/writingListening.css";
import "../css/listening.css";

export default function Listening(props) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [voice, setVoice] = useState();
  const [voiceURI, setVoiceURI] = useState();
  const [records, setCurrentModeId, setConfettiAreEnabled] = useOutletContext();
  const { speak, voices, supported } = useSpeechSynthesis();
  const inputNodeRef = useRef(null);
  const api = useAxios();

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
    document.title = "Listening";
    setCurrentModeId(props.mode);

    const browser = detectBrowser();

    api
      .get(`/voice?browser=${browser}`)
      .then((response) => setVoiceURI(response.data.uri))
      .catch((error) => console.error(error));
  }, [setCurrentModeId, props.mode]);

  useEffect(() => {
    if (voices.length === 0 || !voiceURI) return;

    setVoice(voices.find((voice) => voice.voiceURI === voiceURI));
  }, [voices, voiceURI]);

  useEffect(() => {
    if (isEnd) setConfettiAreEnabled(true);
  }, [isEnd, setConfettiAreEnabled]);

  useEffect(() => {
    if (records.length === 0 || currentRecordIndex === 0) return;

    if (currentRecordIndex >= records.length) setIsEnd(true);
    else speak({ text: records[currentRecordIndex].term, voice });
  }, [currentRecordIndex, voice, records]);

  return (
    <div className="listening">
      {isEnd ? (
        <div className="listening--restart" onClick={restart}>
          Start again
        </div>
      ) : (
        <>
          <div className="listening--play-wrapper">
            <img
              className="listening--play"
              src="/images/listen.svg"
              alt="listen"
              draggable={false}
              onClick={() =>
                supported &&
                speak({
                  text: records[currentRecordIndex].term,
                  voice,
                })
              }
            />
          </div>

          <form
            className="listening--form"
            autoComplete="off"
            title=""
            onSubmit={checkAnswer}
          >
            <CSSTransition
              nodeRef={inputNodeRef}
              in={inProp}
              timeout={1000}
              classNames="listening--form--input"
            >
              <input
                className="listening--form--input"
                placeholder="Type your answer here"
                value={answer}
                ref={inputNodeRef}
                autoFocus={true}
                onChange={handleAnswerChange}
              />
            </CSSTransition>
            <button className="listening--form--send">&rarr;</button>
          </form>

          <div className="listening--skip" onClick={increaseCurrentRecordIndex}>
            Skip
          </div>
        </>
      )}
    </div>
  );
}
