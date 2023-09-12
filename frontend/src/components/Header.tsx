import { useState, useEffect, useRef, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import VoiceSelector from "./VoiceSelector";
import useAuth from "../hooks/useAuth";
import useTr from "../hooks/useTr";
import { HeaderTr } from "../translations/componentsTr";
import useAxios from "../hooks/useAxios";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";
import "../css/Header.css";

interface ProfileOptionsProps {
  onImageUploader: (event: MouseEvent<HTMLElement>) => void;
  onVoiceSelector: (event: MouseEvent<HTMLElement>) => void;
  onLogOut: () => void;
}

function ProfileOptions({
  onImageUploader,
  onVoiceSelector,
  onLogOut,
}: ProfileOptionsProps) {
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
  const profileRef = useRef<HTMLDivElement>(null);
  const { logoutUser } = useAuth();
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(event: Event) {
      const profile = profileRef.current;

      if (
        activePanel === "options" &&
        profile &&
        !profile.contains(event.target as Node)
      ) {
        setActivePanel("");
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [activePanel]);

  useEffect(() => {
    const controller = new AbortController();

    if (!profileImageUrl) {
      api
        .get("/profile-image/", { signal: controller.signal })
        .then((response) => {
          const imageUrl = response.data.url;

          sessionStorage.setItem("profileImageUrl", imageUrl);
          setProfileImageUrl(imageUrl);
        })
        .catch((error) => console.error(error));
    }

    return () => controller.abort();
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
            onLogOut={() => {
              logoutUser();
              navigate("/login");
            }}
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
