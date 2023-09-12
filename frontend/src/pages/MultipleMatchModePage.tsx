import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import RestartButton from "../components/RestartButton";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { MultipleMatchModePageTr } from "../translations/pagesTr";
import { ModesTr } from "../translations/miscTr";
import WordSetContext from "interfaces/WordSetContext.interface";
import WordRecord from "interfaces/WordRecord.interface";
import "../css/MultipleMatchModePage.css";

type HandleDrop = (
  id: string,
  definition: string,
  mainRecordId: string,
  mainRecordDefinition: string
) => void;

interface TopbarRecordProps {
  id: string;
  definition: string;
  handleDrop: HandleDrop;
}

interface MainRecordProps extends TopbarRecordProps {
  term: string;
}

function useDragRecordData(
  id: string,
  definition: string,
  handleDrop: HandleDrop
) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "record",
    item: { id, definition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, monitor) => {
      if (monitor.didDrop()) {
        const { mainRecordId, mainRecordDefinition } =
          monitor.getDropResult() as {
            mainRecordId: string;
            mainRecordDefinition: string;
          };

        handleDrop(id, definition, mainRecordId, mainRecordDefinition);
      }
    },
  });

  return { isDragging, dragRef };
}

function TopbarRecord({ id, definition, handleDrop }: TopbarRecordProps) {
  const { isDragging, dragRef } = useDragRecordData(id, definition, handleDrop);

  return (
    <div
      className={`topbar-record ${isDragging ? "dragging" : ""}`}
      ref={dragRef}
    >
      {definition}
    </div>
  );
}

function MainRecord({ id, term, definition, handleDrop }: MainRecordProps) {
  const { isDragging, dragRef } = useDragRecordData(id, definition, handleDrop);

  const [, dropRef] = useDrop({
    accept: "record",
    drop: () => ({ mainRecordId: id, mainRecordDefinition: definition }),
  });

  return (
    <div className="main-record">
      <div className="main-record--term">{term}</div>
      <div
        className={`main-record--definition 
        ${definition ? "filled" : ""} ${isDragging ? "dragging" : ""}`}
        ref={(node) => (definition ? dragRef(dropRef(node)) : dropRef(node))}
      >
        {definition}
      </div>
    </div>
  );
}

function MultipleMatchModePage() {
  const [topbarRecords, setTopbarRecords] = useState<
    { id: string; definition: string }[]
  >([]);
  const [mainRecords, setMainRecords] = useState<WordRecord[]>([]);
  const [result, setResult] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const { records, setCurrentModeId, setAreConfettiEnabled }: WordSetContext =
    useOutletContext();
  const { langCode } = useTr();

  useDocumentTitle(ModesTr["multiple-match"][langCode]);

  function handleDropToMain(
    topbarRecordId: string,
    topbarRecordDefinition: string,
    mainRecordId: string,
    mainRecordDefinition: string
  ) {
    setTopbarRecords((prevTopbarRecords) => {
      if (mainRecordDefinition) {
        return prevTopbarRecords.map((record) =>
          record.id === topbarRecordId
            ? { ...record, definition: mainRecordDefinition }
            : record
        );
      } else {
        return prevTopbarRecords.filter(
          (record) => record.id !== topbarRecordId
        );
      }
    });

    setMainRecords((prevMainRecords) =>
      prevMainRecords.map((record) =>
        record.id === mainRecordId
          ? { ...record, definition: topbarRecordDefinition }
          : record
      )
    );
  }

  function handleDropBetweenMainRecords(
    sourceId: string,
    sourceDefinition: string,
    targetId: string,
    targetDenifition: string
  ) {
    setMainRecords((prevMainRecords) =>
      prevMainRecords.map((record) => {
        if (record.id === sourceId) record.definition = targetDenifition;
        else if (record.id === targetId) record.definition = sourceDefinition;

        return record;
      })
    );
  }

  function correctAnswersQuantity() {
    return mainRecords.reduce(
      (sum, record, index) =>
        record.definition === records[index].definition ? sum + 1 : sum,
      0
    );
  }

  function restart() {
    setAreConfettiEnabled(false);
    setResult(0);
    setIsEnd(false);
    initializeTopbarRecords();
    initializeMainRecords();
  }

  const initializeTopbarRecords = useCallback(() => {
    setTopbarRecords(
      records
        .map(({ id, definition }) => ({
          id,
          definition,
        }))
        .sort((a, b) => {
          if (a.definition > b.definition) {
            return 1;
          } else if (a.definition < b.definition) {
            return -1;
          }
          return 0;
        })
    );
  }, [records]);

  const initializeMainRecords = useCallback(() => {
    setMainRecords(
      records.map(({ id, term }) => ({
        id,
        term,
        definition: "",
      }))
    );
  }, [records]);

  useEffect(() => {
    setCurrentModeId("multiple-match");
  }, [setCurrentModeId]);

  useEffect(() => {
    if (!records || records.length === 0) {
      return;
    }

    initializeTopbarRecords();
    initializeMainRecords();
  }, [records, initializeTopbarRecords, initializeMainRecords]);

  useEffect(() => {
    if (isEnd) {
      setAreConfettiEnabled(true);
    }
  }, [isEnd, setAreConfettiEnabled]);

  const topbarRecordWidgets = topbarRecords.map((record) => (
    <TopbarRecord
      key={record.id}
      id={record.id}
      definition={record.definition}
      handleDrop={handleDropToMain}
    />
  ));

  const mainRecordWidgets = mainRecords.map(({ id, term, definition }) => (
    <MainRecord
      key={id}
      id={id}
      term={term}
      definition={definition}
      handleDrop={handleDropBetweenMainRecords}
    />
  ));

  const backend = "ontouchstart" in window ? TouchBackend : HTML5Backend;

  return (
    <div className="multiple-match-mode-page">
      {isEnd ? (
        <>
          <h1 className="multiple-match-mode-page--result">
            {`${MultipleMatchModePageTr.result[langCode]} ${result}/${
              records?.length || 0
            }`}
          </h1>

          <RestartButton onClick={restart} />
        </>
      ) : (
        <>
          <DndProvider backend={backend}>
            <div className="multiple-match-mode-page--topbar">
              {topbarRecordWidgets}
            </div>

            <div className="multiple-match-mode-page--main">
              {mainRecordWidgets}
            </div>
          </DndProvider>

          <button
            className="multiple-match-mode-page--check-result"
            onClick={() => {
              setResult(correctAnswersQuantity());
              setIsEnd(true);
            }}
          >
            {MultipleMatchModePageTr.checkResult[langCode]}
          </button>
        </>
      )}
    </div>
  );
}

export default MultipleMatchModePage;
