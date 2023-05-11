import React, { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import useAxios from "../utils/useAxios";
import detectBrowser from "../utils/detectBrowser";
import "../css/voiceSelection.css";

export default function VoiceSelection(props) {
  const [defaultVoiceURI, setDefaultVoiceURI] = useState();
  const { voices } = useSpeechSynthesis();
  const api = useAxios();

  const handleVoiceSelectChange = (event) => {
    const browser = detectBrowser();
    const uri = event.target.value;

    api
      .put("/update-voice/", { browser, uri })
      .then((response) => {
        alert("Voice has beeen updated successfully!");
        window.location.reload();
      })
      .catch((error) => alert("Something went wrong!"));
  };

  useEffect(() => {
    const browser = detectBrowser();

    api
      .get(`/voice?browser=${browser}`)
      .then((response) => setDefaultVoiceURI(response.data.uri))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="voice-selection">
      <div className="voice-selection--container">
        <select
          className="voice-selection--container--select"
          onChange={handleVoiceSelectChange}
          value={defaultVoiceURI}
        >
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {`${voice.lang} - ${voice.name}`}
            </option>
          ))}
        </select>

        <div
          className="voice-selection--container--close"
          onClick={props.close}
        >
          &#10005;
        </div>
      </div>
    </div>
  );
}
