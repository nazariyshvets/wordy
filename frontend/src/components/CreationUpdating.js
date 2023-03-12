import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import useAxios from "../utils/useAxios";
import { MODES } from "../utils/modesData";
import "../css/creationUpdating.css";
import CreationUpdatingFormRecord from "./CreationUpdatingFormRecord";

export default function CreationUpdating(props) {
  const [title, setTitle] = useState("");
  const [records, setRecords] = useState([
    { id: nanoid(), term: "", definition: "" },
  ]);
  const { wordSetId } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const addRecord = () => {
    setRecords((prevRecords) => [
      ...prevRecords,
      { id: nanoid(), term: "", definition: "" },
    ]);
  };

  const removeRecord = (id) => {
    if (records.length <= 1) return;

    setRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    );
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleRecordChange = (event, id) => {
    const { name, value } = event.target;

    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { ...record, [name]: value } : record
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const url =
      props.mode === MODES.CREATION
        ? "/word-sets/create/"
        : `/word-sets/${wordSetId}/update/`;
    const method = props.mode === MODES.CREATION ? "post" : "put";
    const recordsData = records.map((record) => ({
      term: record.term,
      definition: record.definition,
    }));

    api({
      method,
      url,
      data: {
        word_set: { title },
        records: recordsData,
      },
    })
      .then((response) => {
        alert(
          `Word set has been ${
            props.mode === MODES.CREATION ? "created" : "updated"
          } successfully!`
        );
        props.mode === MODES.CREATION
          ? navigate("/word-sets/")
          : navigate(`/word-sets/${wordSetId}`);
      })
      .catch((error) => alert("Something went wrong!"));
  };

  useEffect(() => {
    document.title = `${
      props.mode === MODES.CREATION ? "Create new word set" : "Update word set"
    }`;
  }, [props.mode]);

  useEffect(() => {
    if (props.mode === MODES.CREATION) return;

    api
      .get(`/word-sets/${wordSetId}/`)
      .then((response) => {
        setTitle(response.data.word_set.title);
        setRecords(
          response.data.records.map((record) => ({
            id: nanoid(),
            term: record.term,
            definition: record.definition,
          }))
        );
      })
      .catch((error) => {
        alert("Failed to retrieve word set data");
        navigate(`/word-sets/${wordSetId}`);
      });
  }, [props.mode, wordSetId, navigate]);

  const recordWidgets = records.map((record) => (
    <CreationUpdatingFormRecord
      id={record.id}
      term={record.term}
      definition={record.definition}
      key={record.id}
      handleChange={handleRecordChange}
      handleRemove={() => removeRecord(record.id)}
    />
  ));

  return (
    <div className="creation-updating">
      <h1 className="creation-updating--title">
        {props.mode === MODES.CREATION
          ? "Create new word set"
          : "Update word set"}
      </h1>
      <form
        className="creation-updating--form"
        autoComplete="off"
        title=""
        onSubmit={handleSubmit}>
        <input
          className="creation-updating--form--input title"
          placeholder="title"
          value={title}
          required
          autoFocus={true}
          maxLength={200}
          onChange={handleTitleChange}
        />
        {recordWidgets}
        <img
          className="creation-updating--form--add"
          src="/media/plus.svg"
          alt="add new record"
          draggable={false}
          onClick={addRecord}
        />
        <button className="form--button">Confirm</button>
      </form>
    </div>
  );
}
