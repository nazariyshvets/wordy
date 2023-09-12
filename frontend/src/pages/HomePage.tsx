import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "react-loading";
import PageTitle from "../components/PageTitle";
import useTr from "../hooks/useTr";
import { HomePageTr } from "../translations/pagesTr";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useAxios from "../hooks/useAxios";
import "../css/HomePage.css";

interface WordSet {
  id: number;
  title: string;
}

function CreateWordSetLink() {
  return (
    <Link
      to="/word-sets/create"
      className="create-word-set-link"
      draggable={false}
    >
      <img
        src="/images/plus.svg"
        alt="add a new word set"
        className="create-word-set-link--img"
        draggable={false}
      />
    </Link>
  );
}

function HomePage() {
  const [wordSets, setWordSets] = useState<WordSet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { langCode } = useTr();
  const api = useAxios();

  useDocumentTitle(HomePageTr.title[langCode]);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/word-sets/", { signal: controller.signal })
      .then((response) =>
        setWordSets(
          response.data.map(({ id, title }: WordSet) => ({ id, title }))
        )
      )
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [api]);

  const filteredWordSets = wordSets.filter((wordSet) =>
    wordSet.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const wordSetLinks = filteredWordSets.map((wordSet) => (
    <Link
      key={wordSet.id}
      className="home-page--word-set-link"
      to={`/word-sets/${wordSet.id}`}
      draggable={false}
    >
      {wordSet.title}
    </Link>
  ));

  return (
    <div className="home-page">
      <input
        type="text"
        className="home-page--search-input"
        value={searchQuery}
        placeholder={HomePageTr.search[langCode]}
        maxLength={200}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      <div className="home-page--title-wrapper">
        <PageTitle text={HomePageTr.wordSets[langCode]} />

        <CreateWordSetLink />
      </div>

      {isLoading ? (
        <div className="home-page--loading-wrapper">
          <Loading type="spinningBubbles" color="#fefdfd" />
        </div>
      ) : wordSets.length === 0 ? (
        <p className="home-page--no-word-sets">
          {HomePageTr.noWordSets[langCode]}
        </p>
      ) : filteredWordSets.length === 0 ? (
        <p className="home-page--no-word-sets-with-provided-title">
          {HomePageTr.noWordSetsWithProvidedTitle[langCode]}
        </p>
      ) : (
        <div className="home-page--word-set-links">{wordSetLinks}</div>
      )}
    </div>
  );
}

export default HomePage;
