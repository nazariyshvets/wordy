import { useState, useEffect, useCallback, FormEvent } from "react";
import { useOutletContext } from "react-router-dom";
import { useSpeechSynthesis } from "react-speech-kit";
import InteractiveAnswerForm from "../components/InteractiveAnswerForm";
import RestartButton from "../components/RestartButton";
import Skip from "../components/Skip";
import useAxios from "../hooks/useAxios";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { ModesTr } from "../translations/miscTr";
import detectBrowser from "../utils/detectBrowser";
import WordSetContext from "interfaces/WordSetContext.interface";
import Voice from "interfaces/Voice.interface";
import "../css/ListeningModePage.css";

const browser = detectBrowser();

function ListeningModePage() {
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [inProp, setInProp] = useState(false);
  const [voiceURI, setVoiceURI] = useState(
    localStorage.getItem("voiceURI") || ""
  );
  const { records, setCurrentModeId, setAreConfettiEnabled }: WordSetContext =
    useOutletContext();
  const { speak, voices, supported } = useSpeechSynthesis();
  const { langCode } = useTr();
  const api = useAxios();

  useDocumentTitle(ModesTr["listening"][langCode]);

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

  const getVoice = useCallback(() => {
    if (!voices || !voiceURI) {
      return null;
    }

    return voices.find((voice: Voice) => voice.voiceURI === voiceURI) ?? null;
  }, [voiceURI, voices]);

  const handleSpeak = useCallback(() => {
    if (supported) {
      const text = records[currentRecordIndex]?.term ?? "";
      const voice = getVoice();

      speak({ text, voice });
    }
  }, [supported, records, currentRecordIndex, getVoice]);

  useEffect(() => {
    setCurrentModeId("listening");
  }, [setCurrentModeId]);

  useEffect(() => {
    const controller = new AbortController();

    if (!voiceURI) {
      api
        .get(`/voice?browser=${browser}`, { signal: controller.signal })
        .then((response) => {
          const uri = response.data.uri;

          localStorage.setItem("voiceURI", uri);
          setVoiceURI(uri);
        })
        .catch((error) => console.error(error));
    }

    return () => controller.abort();
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
