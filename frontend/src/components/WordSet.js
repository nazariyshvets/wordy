import React, { useState, useEffect } from "react";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import useAxios from "../utils/useAxios";
import modesData from "../utils/modesData";
import "../css/wordSet.css";

export default function WordSet() {
  const [currentModeId, setCurrentModeId] = useState("");
  const [records, setRecords] = useState([]);
  const [menuIsActive, setMenuIsActive] = useState(false);
  const [confettiAreEnabled, setConfettiAreEnabled] = useState(false);
  const { wordSetId } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/word-sets/${wordSetId}`)
      .then((response) => setRecords(response.data.records))
      .catch((error) => {
        alert("Records haven't been loaded!");
        navigate("/word-sets");
      });
  }, [wordSetId, navigate]);

  useEffect(() => {
    setMenuIsActive(false);
  }, [currentModeId]);

  useEffect(() => {
    if (confettiAreEnabled)
      setTimeout(() => setConfettiAreEnabled(false), 5000);
  }, [confettiAreEnabled]);

  const modeLinks = modesData.map((mode) => (
    <Link
      className={mode.id === currentModeId ? "selected" : ""}
      to={`/word-sets/${wordSetId}/${mode.id}`}
      key={mode.id}
      draggable={false}>
      {mode.title}
    </Link>
  ));

  return (
    <div className="word-set">
      {confettiAreEnabled && (
        <ReactConfetti
          width={window.innerWidth - 61}
          height={window.innerHeight - 91}
        />
      )}

      <div
        className={`word-set--hamburger-menu ${menuIsActive ? "active" : ""}`}
        onClick={() =>
          setMenuIsActive((prevMenuIsActive) => !prevMenuIsActive)
        }>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <section className={`word-set--sidebar ${menuIsActive ? "active" : ""}`}>
        <div className="word-set--sidebar--modes">{modeLinks}</div>
        <Link
          className="word-set--sidebar--update"
          to={`/word-sets/${wordSetId}/update`}
          draggable={false}>
          Update word set
        </Link>
        <Link
          className="word-set--sidebar--delete"
          to={`/word-sets/${wordSetId}/delete`}
          draggable={false}>
          Delete word set
        </Link>
      </section>
      <section className="word-set--main">
        <Outlet context={[records, setCurrentModeId, setConfettiAreEnabled]} />
      </section>
    </div>
  );
}
