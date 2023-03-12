import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";
import "../css/wordSetsIndex.css";

export default function WordSets() {
  const [wordSets, setWordSets] = useState([]);
  const [search, setSearch] = useState("");
  const api = useAxios();

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    document.title = "Home page";

    api
      .get("/word-sets/")
      .then((response) => setWordSets(response.data))
      .catch((error) => console.error(error));
  }, []);

  const filteredWordSets = wordSets?.filter((wordSet) =>
    wordSet.title.toLowerCase().includes(search.toLowerCase())
  );
  const wordSetLinks = filteredWordSets.map((wordSet) => (
    <Link
      className="word-sets--links--link"
      to={`/word-sets/${wordSet.id}`}
      key={wordSet.id}
      draggable={false}
      translate="no">
      {wordSet.title}
    </Link>
  ));

  return (
    <div className="word-sets">
      <form className="word-sets--form" autoComplete="off" title="">
        <input
          className="word-sets--form--input"
          name="search"
          placeholder="Enter name of set"
          value={search}
          maxLength={200}
          onChange={handleSearch}
        />
      </form>

      <div className="word-sets--title-wrapper">
        <h1 className="word-sets--title">Word sets</h1>
        <Link
          className="word-sets--create"
          to="/word-sets/create"
          draggable={false}>
          <img
            className="word-sets--create--img"
            src="/media/plus.svg"
            alt="add new set"
            draggable={false}
          />
        </Link>
      </div>

      {wordSets.length === 0 ? (
        <p className="word-sets--empty">You don't have word sets yet</p>
      ) : (
        <div className="word-sets--links">{wordSetLinks}</div>
      )}
    </div>
  );
}
