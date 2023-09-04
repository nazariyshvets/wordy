import { useState, useEffect } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import Loading from "react-loading";
import { CancelToken } from "axios";
import Confetti from "react-confetti";
import { useWindowWidth } from "@react-hook/window-size";
import HamburgerMenu from "../components/HamburgerMenu";
import useAxios from "../hooks/useAxios";
import useTr from "../hooks/useTr";
import { WordSetPageTr } from "../translations/pagesTr";
import { ModesTr } from "../translations/miscTr";
import MODES from "../constants/MODES";
import "../css/WordSetPage.css";

function WordSetPage() {
  const [currentModeId, setCurrentModeId] = useState("");
  const [records, setRecords] = useState([]);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [areConfettiEnabled, setAreConfettiEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { wordSetId } = useParams();
  const { langCode } = useTr();
  const api = useAxios();
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();

  useEffect(() => {
    const source = CancelToken.source();

    api
      .get(`/word-sets/${wordSetId}/`, { cancelToken: source.token })
      .then((response) => setRecords(response.data.words))
      .catch((error) => {
        console.error(error);

        if (error.code !== "ERR_CANCELED") {
          navigate("/word-sets");
        }
      })
      .finally(() => setIsLoading(false));

    return () => {
      source.cancel(
        "Request canceled due to component unmount or effect re-run."
      );
    };
  }, [api, wordSetId, navigate]);

  useEffect(() => {
    setIsMenuActive(false);
  }, [currentModeId]);

  useEffect(() => {
    if (areConfettiEnabled) {
      const id = setTimeout(() => setAreConfettiEnabled(false), 5000);

      return () => clearTimeout(id);
    }
  }, [areConfettiEnabled]);

  const modeLinks = MODES.map((mode) => (
    <Link
      key={mode.id}
      to={`/word-sets/${wordSetId}/${mode.id}`}
      className={mode.id === currentModeId ? "selected" : ""}
      draggable={false}
    >
      {ModesTr[mode.id][langCode]}
    </Link>
  ));

  return (
    <div className="word-set-page">
      {areConfettiEnabled && (
        <div className="word-set-page--confetti-wrapper">
          <Confetti />
        </div>
      )}

      {windowWidth <= 1024 && (
        <div className="word-set-page--menu-wrapper">
          <HamburgerMenu
            isActive={isMenuActive}
            onClick={() =>
              setIsMenuActive((prevIsMenuActive) => !prevIsMenuActive)
            }
          />
        </div>
      )}

      {isLoading ? (
        <div className="word-set-page--loading-wrapper">
          <Loading type="spinningBubbles" color="#fefdfd" />
        </div>
      ) : (
        <>
          <section
            className={`word-set-page--sidebar ${isMenuActive ? "active" : ""}`}
          >
            <div className="word-set-page--sidebar--modes">{modeLinks}</div>
            <Link
              to={`/word-sets/${wordSetId}/update`}
              className="word-set-page--sidebar--update"
              draggable={false}
            >
              {WordSetPageTr.updateWordSet[langCode]}
            </Link>
            <Link
              to={`/word-sets/${wordSetId}/delete`}
              className="word-set-page--sidebar--delete"
              draggable={false}
            >
              {WordSetPageTr.deleteWordSet[langCode]}
            </Link>
          </section>
          <section className="word-set-page--main">
            <Outlet
              context={[records, setCurrentModeId, setAreConfettiEnabled]}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default WordSetPage;
