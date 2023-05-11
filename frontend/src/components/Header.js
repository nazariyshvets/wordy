import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import "../css/header.css";
import ImageUploading from "./ImageUploading";
import VoiceSelection from "./VoiceSelection";

export default function Header() {
  const [optionsAreVisible, setOptionsAreVisible] = useState(false);
  const [imageUploadingIsVisible, setImageUploadingIsVisible] = useState(false);
  const [voiceSelectionIsVisible, setVoiceSelectionIsVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const { logoutUser } = useContext(AuthContext);
  const api = useAxios();

  useEffect(() => {
    api
      .get("/profile-image/")
      .then((response) => setProfileImageUrl(response.data.url))
      .catch((error) => console.error(error));
  }, []);

  return (
    <header>
      <Link
        className="header--title"
        to="/word-sets"
        draggable={false}
        translate="no"
      >
        Wordy
      </Link>

      <div className="header--profile">
        <img
          className="header--profile--img"
          src={profileImageUrl}
          alt="profile"
          draggable={false}
        />
        <div
          className="header--profile--mark"
          onClick={() =>
            setOptionsAreVisible(
              (prevOptionsAreVisible) => !prevOptionsAreVisible
            )
          }
        ></div>
        {optionsAreVisible && (
          <ul className="header--profile--options">
            <li
              onClick={() => {
                setImageUploadingIsVisible(true);
                setOptionsAreVisible(false);
              }}
            >
              Upload image
            </li>
            <li
              onClick={() => {
                setVoiceSelectionIsVisible(true);
                setOptionsAreVisible(false);
              }}
            >
              Set voice
            </li>
            <li onClick={logoutUser}>Logout</li>
          </ul>
        )}
      </div>

      {imageUploadingIsVisible && (
        <ImageUploading
          setProfileImageUrl={setProfileImageUrl}
          close={() => setImageUploadingIsVisible(false)}
        />
      )}

      {voiceSelectionIsVisible && (
        <VoiceSelection close={() => setVoiceSelectionIsVisible(false)} />
      )}
    </header>
  );
}
