import { useState, useEffect, ChangeEvent } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import Loading from "react-loading";
import { useAlert } from "react-alert";
import useTr from "../hooks/useTr";
import { VoiceSelectorTr } from "../translations/componentsTr";
import useAxios from "../hooks/useAxios";
import detectBrowser from "../utils/detectBrowser";
import Voice from "interfaces/Voice.interface";
import "../css/VoiceSelector.css";

interface VoiceSelectorProps {
  onClose: () => void;
}

const browser = detectBrowser();

function VoiceSelector({ onClose }: VoiceSelectorProps) {
  const [voiceURI, setVoiceURI] = useState(
    localStorage.getItem("voiceURI") || ""
  );
  const [isLoading, setIsLoading] = useState(!voiceURI);
  const { voices } = useSpeechSynthesis();
  const { langCode } = useTr();
  const alert = useAlert();
  const api = useAxios();

  function handleVoiceSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const uri = event.target.value;

    api
      .put("/voice/update/", { browser, uri })
      .then(() => {
        localStorage.setItem("voiceURI", uri);
        setVoiceURI(uri);
        alert.success(VoiceSelectorTr.voiceUpdated[langCode]);
        onClose();
      })
      .catch((error) => {
        alert.error(VoiceSelectorTr.voiceUpdatingFailed[langCode]);
        console.error(error);
      });
  }

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
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }

    return () => controller.abort();
  }, [voiceURI, api]);

  const voiceOptions = voices.map((voice: Voice) => (
    <option key={voice.voiceURI} value={voice.voiceURI}>
      {`${voice.lang} - ${voice.name}`}
    </option>
  ));

  return (
    <div className="voice-selector">
      <div className="voice-selector--container">
        <div className="voice-selector--container--close" onClick={onClose}>
          &#10006;
        </div>

        {isLoading ? (
          <Loading type="spinningBubbles" color="#5f43b2" />
        ) : (
          <select
            className="voice-selector--container--select"
            value={voiceURI}
            onChange={handleVoiceSelectChange}
          >
            {voiceOptions}
          </select>
        )}
      </div>
    </div>
  );
}

export default VoiceSelector;
