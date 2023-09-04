import { useState, useEffect, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import RestartButton from "../components/RestartButton";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { MultipleMatchModePageTr } from "../translations/pagesTr";
import { ModesTr } from "../translations/miscTr";
import "../css/MultipleMatchModePage.css";

function useDragRecordData(id, definition, handleDrop) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "record",
    item: { id, definition },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const { mainRecordId, mainRecordDefinition } = monitor.getDropResult();

        handleDrop(id, definition, mainRecordId, mainRecordDefinition);
      }
    },
  });

  return { isDragging, dragRef };
}

function TopbarRecord({ id, definition, handleDrop }) {
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

function MainRecord({ id, term, definition, handleDrop }) {
  const { isDragging, dragRef } = useDragRecordData(id, definition, handleDrop);

  const [, dropRef] = useDrop({
    accept: "record",
    drop: () => ({ mainRecordId: id, mainRecordDefinition: definition }),
  });

  const ref = useRef(null);
  const dragDropRef = definition ? dragRef(dropRef(ref)) : dropRef(ref);

  return (
    <div className="main-record">
      <div className="main-record--term">{term}</div>
      <div
        className={`main-record--definition 
        ${definition ? "filled" : ""} ${isDragging ? "dragging" : ""}`}
        ref={dragDropRef}
      >
        {definition}
      </div>
    </div>
  );
}

function MultipleMatchModePage({ mode }) {
  const [topbarRecords, setTopbarRecords] = useState([]);
  const [mainRecords, setMainRecords] = useState([]);
  const [result, setResult] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [records, setCurrentModeId, setAreConfettiEnabled] = useOutletContext();
  const { langCode } = useTr();

  useDocumentTitle(ModesTr[mode][langCode]);

  function handleDropToMain(
    topbarRecordId,
    topbarRecordDefinition,
    mainRecordId,
    mainRecordDefinition
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
    sourceId,
    sourceDefinition,
    targetId,
    targetDenifition
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
        .map((record) => ({
          id: record.id,
          definition: record.definition,
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
      records.map((record) => ({
        id: record.id,
        term: record.term,
        definition: null,
      }))
    );
  }, [records]);

  useEffect(() => {
    setCurrentModeId(mode);
  }, [setCurrentModeId, mode]);

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

  const mainRecordWidgets = mainRecords.map((record) => (
    <MainRecord
      key={record.id}
      id={record.id}
      term={record.term}
      definition={record.definition}
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
