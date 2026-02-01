import { useState, useEffect, useRef, useMemo, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, useBlocker } from "react-router-dom";
import Loading from "react-loading";
import { nanoid } from "nanoid";
import { useAlert } from "react-alert";
import LeaveConfirmModal from "../components/LeaveConfirmModal";
import PageTitle from "../components/PageTitle";
import SubmitButton from "../components/SubmitButton";
import useAxios from "../hooks/useAxios";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { LanguageCode } from "contexts/TrContext";
import { CreateUpdateWordSetPageTr } from "../translations/pagesTr";
import WordRecord from "interfaces/WordRecord.interface";
import ApiWordRecord from "interfaces/ApiWordRecord.interface";
import "../css/CreateUpdateWordSetPage.css";

const recordsEqual = (a: WordRecord[], b: WordRecord[]): boolean =>
  a.length === b.length &&
  a.every((r, i) => r.term === b[i].term && r.definition === b[i].definition);

interface TitleInputProps {
  title: string;
  langCode: LanguageCode;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface FormRecordProps {
  term: string;
  definition: string;
  langCode: LanguageCode;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

interface CreateUpdateWordSetPageProps {
  isCreating: boolean;
}

function TitleInput({ title, langCode, onChange }: TitleInputProps) {
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

function FormRecord({
  term,
  definition,
  langCode,
  onChange,
  onRemove,
}: FormRecordProps) {
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

function CreateUpdateWordSetPage({ isCreating }: CreateUpdateWordSetPageProps) {
  const [title, setTitle] = useState("");
  const [existingRecords, setExistingRecords] = useState<WordRecord[]>([]);
  const [newRecords, setNewRecords] = useState<WordRecord[]>(
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
  const allowNavigationRef = useRef(false);
  const initialSnapshotRef = useRef<{
    title: string;
    existingRecords: WordRecord[];
    newRecords: WordRecord[];
  } | null>(null);

  const hasUnsavedChanges = useMemo(() => {
    if (isCreating) {
      return (
        title.trim() !== "" ||
        newRecords.length > 1 ||
        newRecords.some(
          (r) => r.term.trim() !== "" || r.definition.trim() !== ""
        )
      );
    }
    const initial = initialSnapshotRef.current;
    if (!initial) return false;
    return (
      title !== initial.title ||
      !recordsEqual(existingRecords, initial.existingRecords) ||
      !recordsEqual(newRecords, initial.newRecords)
    );
  }, [isCreating, title, existingRecords, newRecords]);

  const shouldBlockNavigation = hasUnsavedChanges && !allowNavigationRef.current;
  const blocker = useBlocker(shouldBlockNavigation);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

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

  function removeRecord(id: string) {
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

  function handleRecordChange(
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) {
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isProcessing) {
      return;
    }
    setIsProcessing(true);

    const url = isCreating
      ? "/word-sets/create/"
      : `/word-sets/${wordSetId}/update/`;
    const method = isCreating ? "post" : "put";
    const existingRecordsData = existingRecords.map(
      ({ id, term, definition }) => ({
        id: Number(id),
        term,
        definition,
      })
    );
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
        words: [...existingRecordsData, ...newRecordsData],
      },
    })
      .then(() => {
        alert.success(
          isCreating
            ? CreateUpdateWordSetPageTr.created[langCode]
            : CreateUpdateWordSetPageTr.updated[langCode]
        );
        allowNavigationRef.current = true;
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
    const controller = new AbortController();

    if (!isCreating) {
      api
        .get(`/word-sets/${wordSetId}/`, { signal: controller.signal })
        .then((response) => {
          const loadedTitle = response.data.word_set.title;
          const loadedRecords = response.data.words.map(
            ({ id, term, definition }: ApiWordRecord) => ({
              id: id.toString(),
              term,
              definition,
            })
          );
          setTitle(loadedTitle);
          setExistingRecords(loadedRecords);
          initialSnapshotRef.current = {
            title: loadedTitle,
            existingRecords: loadedRecords,
            newRecords: [],
          };
        })
        .catch((error) => {
          console.error(error);

          if (error.code !== "ERR_CANCELED") {
            navigate(`/word-sets/${wordSetId}`);
          }
        })
        .finally(() => setIsLoading(false));
    }

    return () => controller.abort();
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
      <LeaveConfirmModal
        isOpen={blocker.state === "blocked"}
        title={CreateUpdateWordSetPageTr.leaveConfirmTitle[langCode]}
        message={CreateUpdateWordSetPageTr.leaveConfirmMessage[langCode]}
        leaveText={CreateUpdateWordSetPageTr.leaveConfirmLeave[langCode]}
        stayText={CreateUpdateWordSetPageTr.leaveConfirmStay[langCode]}
        onLeave={() => blocker.proceed?.()}
        onStay={() => blocker.reset?.()}
      />
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
