import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import Loading from "react-loading";
import Confetti from "react-confetti";
import { useWindowWidth } from "@react-hook/window-size";
import shuffle from "shuffle-array";
import HamburgerMenu from "../components/HamburgerMenu";
import useAxios from "../hooks/useAxios";
import useTr from "../hooks/useTr";
import { WordSetPageTr } from "../translations/pagesTr";
import { ModesTr } from "../translations/miscTr";
import MODES from "../constants/MODES";
import WordRecord from "interfaces/WordRecord.interface";
import ApiWordRecord from "interfaces/ApiWordRecord.interface";
import "../css/WordSetPage.css";

function WordSetPage() {
  const [currentModeId, setCurrentModeId] = useState("");
  const [records, setRecords] = useState<WordRecord[]>([]);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [areConfettiEnabled, setAreConfettiEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const confettiIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { wordSetId } = useParams();
  const { langCode } = useTr();
  const api = useAxios();
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (records.length === 0) {
      api
        .get(`/word-sets/${wordSetId}/`, { signal: controller.signal })
        .then((response) =>
          setRecords(
            response.data.words.map(
              ({ id, term, definition }: ApiWordRecord) => ({
                id: id.toString(),
                term,
                definition,
              })
            )
          )
        )
        .catch((error) => {
          console.error(error);

          if (error.code !== "ERR_CANCELED") {
            navigate("/word-sets");
          }
        })
        .finally(() => setIsLoading(false));
    }

    return () => {
      controller.abort();
    };
  }, [api, wordSetId, navigate, records]);

  useEffect(() => {
    setIsMenuActive(false);
  }, [currentModeId]);

  useEffect(() => {
    setRecords((prevRecords) => shuffle([...prevRecords]));
  }, [currentModeId]);

  useEffect(() => {
    if (areConfettiEnabled) {
      confettiIdRef.current = setTimeout(
        () => setAreConfettiEnabled(false),
        5000
      );
    }

    return () => {
      const confettiId = confettiIdRef.current;

      if (confettiId) {
        clearTimeout(confettiId);
      }
    };
  }, [areConfettiEnabled]);

  const modeLinks = MODES.map((mode) => (
    <Link
      key={mode.id}
      to={`/word-sets/${wordSetId}/${mode.id}`}
      className={mode.id === currentModeId ? "selected" : ""}
      draggable={false}
    >
      {ModesTr[mode.id as keyof typeof ModesTr][langCode]}
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
              context={{ records, setCurrentModeId, setAreConfettiEnabled }}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default WordSetPage;
