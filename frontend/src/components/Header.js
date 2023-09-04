import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CancelToken } from "axios";
import ImageUploader from "./ImageUploader";
import VoiceSelector from "./VoiceSelector";
import useAuth from "../hooks/useAuth";
import useTr from "../hooks/useTr";
import { HeaderTr } from "../translations/componentsTr";
import useAxios from "../hooks/useAxios";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";
import "../css/Header.css";

function ProfileOptions({ onImageUploader, onVoiceSelector, onLogOut }) {
  const { langCode } = useTr();

  return (
    <ul className="profile-options">
      <li onClick={onImageUploader}>{HeaderTr.uploadImage[langCode]}</li>
      <li onClick={onVoiceSelector}>{HeaderTr.setVoice[langCode]}</li>
      <li onClick={onLogOut}>{HeaderTr.logOut[langCode]}</li>
    </ul>
  );
}

function Header() {
  const [activePanel, setActivePanel] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(
    sessionStorage.getItem("profileImageUrl") || ""
  );
  const profileRef = useRef(null);
  const { logoutUser } = useAuth();
  const api = useAxios();

  useEffect(() => {
    function handleClick(event) {
      if (
        activePanel === "options" &&
        !profileRef.current.contains(event.target)
      ) {
        setActivePanel("");
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [activePanel]);

  useEffect(() => {
    if (!profileImageUrl) {
      const source = CancelToken.source();

      api
        .get("/profile-image/", { cancelToken: source.token })
        .then((response) => {
          const imageUrl = response.data.url;

          sessionStorage.setItem("profileImageUrl", imageUrl);
          setProfileImageUrl(imageUrl);
        })
        .catch((error) => console.error(error));

      return () => {
        source.cancel(
          "Request canceled due to component unmount or effect re-run."
        );
      };
    }
  }, [profileImageUrl, api]);

  const profileImageSrc = profileImageUrl
    ? BASE_SERVER_URL + profileImageUrl
    : "/images/default_profile_img.png";

  return (
    <header>
      <Link to="/word-sets" className="header--title" draggable={false}>
        Wordy
      </Link>

      <div
        className="header--profile"
        ref={profileRef}
        onClick={() =>
          setActivePanel((prevActivePanel) =>
            prevActivePanel === "options" ? "" : "options"
          )
        }
      >
        <img
          src={profileImageSrc}
          alt="profile"
          className="header--profile--img"
          draggable={false}
        />
        <div className="header--profile--mark"></div>

        {activePanel === "options" && (
          <ProfileOptions
            onImageUploader={(event) => {
              event.stopPropagation();
              setActivePanel("image-uploader");
            }}
            onVoiceSelector={(event) => {
              event.stopPropagation();
              setActivePanel("voice-selector");
            }}
            onLogOut={logoutUser}
          />
        )}
      </div>

      {activePanel === "image-uploader" && (
        <ImageUploader
          setProfileImageUrl={setProfileImageUrl}
          onClose={() => setActivePanel("")}
        />
      )}

      {activePanel === "voice-selector" && (
        <VoiceSelector onClose={() => setActivePanel("")} />
      )}
    </header>
  );
}

export default Header;
