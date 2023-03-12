import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../css/multipleMatch.css";
import TopbarRecord from "./MultipleMatchTopbarRecord";
import MainRecord from "./MultipleMatchMainRecord";

export default function MultipleMatch(props) {
  const [isEnd, setIsEnd] = useState(false);
  const [topbarRecords, setTopbarRecords] = useState([]);
  const [mainRecords, setMainRecords] = useState([]);
  const [result, setResult] = useState(0);
  const [records, setCurrentModeId, setConfettiAreEnabled] = useOutletContext();

  const handleDropToMain = (
    topbarRecordId,
    topbarRecordDefinition,
    mainRecordId,
    mainRecordDefinition
  ) => {
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
  };

  const handleDropBetweenMainRecords = (
    sourceId,
    sourceDefinition,
    targetId,
    targetDenifition
  ) => {
    setMainRecords((prevMainRecords) =>
      prevMainRecords.map((record) => {
        if (record.id === sourceId) record.definition = targetDenifition;
        else if (record.id === targetId) record.definition = sourceDefinition;

        return record;
      })
    );
  };

  const correctAnswersQuantity = () => {
    return mainRecords.reduce(
      (accumulator, record, index) =>
        record.definition === records[index].definition
          ? accumulator + 1
          : accumulator,
      0
    );
  };

  const restart = () => {
    setConfettiAreEnabled(false);
    setIsEnd(false);
    setResult(0);
    initializeTopbarRecords();
    initializeMainRecords();
  };

  const initializeTopbarRecords = useCallback(() => {
    setTopbarRecords(
      records
        .map((record) => ({
          id: record.id,
          definition: record.definition,
        }))
        .sort((a, b) => {
          if (a.definition < b.definition) return -1;
          else if (a.definition > b.definition) return 1;
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
    document.title = "Multiple match";

    setCurrentModeId(props.mode);
  }, [setCurrentModeId, props.mode]);

  useEffect(() => {
    if (records.length === 0) return;

    initializeTopbarRecords();
    initializeMainRecords();
  }, [records, initializeTopbarRecords, initializeMainRecords]);

  useEffect(() => {
    if (isEnd) setConfettiAreEnabled(true);
  }, [isEnd, setConfettiAreEnabled]);

  const topbarRecordWidgets = topbarRecords?.map((record) => (
    <TopbarRecord
      id={record.id}
      definition={record.definition}
      key={record.id}
      handleDrop={handleDropToMain}
    />
  ));

  const mainRecordWidgets = mainRecords?.map((record) => (
    <MainRecord
      id={record.id}
      term={record.term}
      definition={record.definition}
      key={record.id}
      handleDrop={handleDropBetweenMainRecords}
    />
  ));

  return (
    <div className="multiple-match">
      {isEnd ? (
        <>
          <h1 className="multiple-match--result">
            Your result is {`${result}/${records.length}`}
          </h1>
          <div className="multiple-match--restart" onClick={restart}>
            Start again
          </div>
        </>
      ) : (
        <>
          <DndProvider backend={HTML5Backend}>
            <div className="multiple-match--topbar" translate="no">
              {topbarRecordWidgets}
            </div>
            <div className="multiple-match--main" translate="no">
              {mainRecordWidgets}
            </div>
          </DndProvider>
          <button
            className="multiple-match--check"
            onClick={() => {
              setResult(correctAnswersQuantity());
              setIsEnd(true);
            }}>
            Check result
          </button>
        </>
      )}
    </div>
  );
}
