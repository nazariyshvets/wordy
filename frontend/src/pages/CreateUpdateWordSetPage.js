import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "react-loading";
import { nanoid } from "nanoid";
import { CancelToken } from "axios";
import { useAlert } from "react-alert";
import PageTitle from "../components/PageTitle";
import SubmitButton from "../components/SubmitButton";
import useAxios from "../hooks/useAxios";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { CreateUpdateWordSetPageTr } from "../translations/pagesTr";
import "../css/CreateUpdateWordSetPage.css";

function TitleInput({ title, langCode, onChange }) {
  return (
    <input
      className="title-input"
      value={title}
      maxLength={200}
      placeholder={CreateUpdateWordSetPageTr.recordTitle[langCode]}
      autoFocus={true}
      required
      onChange={onChange}
    />
  );
}

function FormRecord({ term, definition, langCode, onChange, onRemove }) {
  return (
    <div className="form-record">
      <input
        className="form-record--input"
        name="term"
        value={term}
        placeholder={CreateUpdateWordSetPageTr.recordTerm[langCode]}
        maxLength={200}
        required
        onChange={onChange}
      />
      <input
        className="form-record--input"
        name="definition"
        value={definition}
        placeholder={CreateUpdateWordSetPageTr.recordDefinition[langCode]}
        maxLength={400}
        required
        onChange={onChange}
      />
      <div className="form-record--remove" onClick={onRemove}>
        &#10006;
      </div>
    </div>
  );
}

function CreateUpdateWordSetPage({ isCreating }) {
  const [title, setTitle] = useState("");
  const [existingRecords, setExistingRecords] = useState([]);
  const [newRecords, setNewRecords] = useState(
    isCreating ? [{ id: nanoid(), term: "", definition: "" }] : []
  );
  // if the current mode is updating then wait until the word set is fetched
  const [isLoading, setIsLoading] = useState(!isCreating);
  // specifies whether the request for creating/updating is being processed
  const [isProcessing, setIsProcessing] = useState(false);
  const { langCode } = useTr();
  const { wordSetId } = useParams();
  const alert = useAlert();
  const api = useAxios();
  const navigate = useNavigate();

  useDocumentTitle(
    isCreating
      ? CreateUpdateWordSetPageTr.createPageTitle[langCode]
      : CreateUpdateWordSetPageTr.updatePageTitle[langCode]
  );

  function addRecord() {
    setNewRecords((prevRecords) => [
      ...prevRecords,
      { id: nanoid(), term: "", definition: "" },
    ]);
  }

  function removeRecord(id) {
    // There has to be at least one record
    if (existingRecords.length + newRecords.length <= 1) {
      return;
    }

    setExistingRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    );
    setNewRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    );
  }

  function handleRecordChange(event, id) {
    const { name, value } = event.target;

    setExistingRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, [name]: value } : record
      )
    );
    setNewRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, [name]: value } : record
      )
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isProcessing) {
      return;
    }
    setIsProcessing(true);

    const url = isCreating
      ? "/word-sets/create/"
      : `/word-sets/${wordSetId}/update/`;
    const method = isCreating ? "post" : "put";
    // we have to pass only terms and definitions to create new records
    const newRecordsData = newRecords.map(({ term, definition }) => ({
      term,
      definition,
    }));

    api({
      method,
      url,
      data: {
        word_set: { title },
        words: [...existingRecords, ...newRecordsData],
      },
    })
      .then((response) => {
        alert.success(
          isCreating
            ? CreateUpdateWordSetPageTr.created[langCode]
            : CreateUpdateWordSetPageTr.updated[langCode]
        );
        isCreating
          ? navigate("/word-sets/")
          : navigate(`/word-sets/${wordSetId}`);
      })
      .catch((error) => {
        const errorData = error.response.data;

        alert.error(CreateUpdateWordSetPageTr.somethingWentWrong[langCode]);
        console.error(errorData);
      })
      .finally(() => setIsProcessing(false));
  }

  useEffect(() => {
    if (!isCreating) {
      const source = CancelToken.source();

      api
        .get(`/word-sets/${wordSetId}/`, { cancelToken: source.token })
        .then((response) => {
          setTitle(response.data.word_set.title);
          setExistingRecords(
            response.data.words.map(({ id, term, definition }) => ({
              id,
              term,
              definition,
            }))
          );
        })
        .catch((error) => {
          console.error(error);

          if (error.code !== "ERR_CANCELED") {
            navigate(`/word-sets/${wordSetId}`);
          }
        })
        .finally(() => setIsLoading(false));

      return () => {
        source.cancel(
          "Request canceled due to component unmount or effect re-run."
        );
      };
    }
  }, [isCreating, api, wordSetId, navigate]);

  const recordWidgets = [...existingRecords, ...newRecords].map(
    ({ id, term, definition }) => (
      <FormRecord
        key={id}
        term={term}
        definition={definition}
        langCode={langCode}
        onChange={(event) => handleRecordChange(event, id)}
        onRemove={() => removeRecord(id)}
      />
    )
  );

  return (
    <div className="create-update-word-set-page">
      <PageTitle
        text={
          isCreating
            ? CreateUpdateWordSetPageTr.createPageTitle[langCode]
            : CreateUpdateWordSetPageTr.updatePageTitle[langCode]
        }
      />

      {isLoading ? (
        <Loading type="spinningBubbles" color="#fefdfd" />
      ) : (
        <form
          className="create-update-word-set-page--form"
          autoComplete="off"
          title=""
          onSubmit={handleSubmit}
        >
          <img
            className="create-update-word-set-page--form--add"
            src="/images/plus.svg"
            alt="add new record"
            draggable={false}
            onClick={addRecord}
          />

          <TitleInput
            title={title}
            langCode={langCode}
            onChange={(event) => setTitle(event.target.value)}
          />

          {recordWidgets}

          <SubmitButton text={CreateUpdateWordSetPageTr.confirm[langCode]} />
        </form>
      )}
    </div>
  );
}

export default CreateUpdateWordSetPage;
