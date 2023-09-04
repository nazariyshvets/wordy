import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useSpeechSynthesis } from "react-speech-kit";
import { CancelToken } from "axios";
import InteractiveAnswerForm from "../components/InteractiveAnswerForm";
import RestartButton from "../components/RestartButton";
import Skip from "../components/Skip";
import useAxios from "../hooks/useAxios";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { ModesTr } from "../translations/miscTr";
import detectBrowser from "../utils/detectBrowser";
import "../css/ListeningModePage.css";

const browser = detectBrowser();

function ListeningModePage({ mode }) {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [voiceURI, setVoiceURI] = useState(
    localStorage.getItem("voiceURI") || ""
  );
  const [records, setCurrentModeId, setAreConfettiEnabled] = useOutletContext();
  const { speak, voices, supported } = useSpeechSynthesis();
  const { langCode } = useTr();
  const api = useAxios();

  useDocumentTitle(ModesTr[mode][langCode]);

  function increaseCurrentRecordIndex() {
    setCurrentRecordIndex(
      (prevCurrentRecordIndex) => prevCurrentRecordIndex + 1
    );
  }

  function checkAnswer(event) {
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

  const getVoice = useCallback(() => {
    if (!voices || !voiceURI) {
      return null;
    }

    return voices.find((voice) => voice.voiceURI === voiceURI) ?? null;
  }, [voiceURI, voices]);

  const handleSpeak = useCallback(() => {
    if (supported) {
      const text = records[currentRecordIndex]?.term ?? "";
      const voice = getVoice();

      speak({ text, voice });
    }
  }, [supported, records, currentRecordIndex, getVoice]);

  useEffect(() => {
    setCurrentModeId(mode);
  }, [setCurrentModeId, mode]);

  useEffect(() => {
    if (!voiceURI) {
      const source = CancelToken.source();

      api
        .get(`/voice?browser=${browser}`, { cancelToken: source.token })
        .then((response) => {
          const uri = response.data.uri;

          localStorage.setItem("voiceURI", uri);
          setVoiceURI(uri);
        })
        .catch((error) => console.error(error));

      return () => {
        source.cancel(
          "Request canceled due to component unmount or effect re-run."
        );
      };
    }
  }, [voiceURI, api]);

  useEffect(() => {
    if (isEnd) {
      setAreConfettiEnabled(true);
    }
  }, [isEnd, setAreConfettiEnabled]);

  useEffect(() => {
    if (!records || records.length === 0 || currentRecordIndex === 0) {
      return;
    }

    if (currentRecordIndex >= records.length) {
      setIsEnd(true);
    } else {
      handleSpeak();
    }
  }, [currentRecordIndex, records, handleSpeak]);

  return (
    <div className="listening-mode-page">
      {isEnd ? (
        <RestartButton onClick={restart} />
      ) : (
        <>
          <div className="listening-mode-page--play-wrapper">
            <img
              src="/images/listen.svg"
              alt="listen"
              className="listening-mode-page--play"
              draggable={false}
              onClick={handleSpeak}
            />
          </div>

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

export default ListeningModePage;
