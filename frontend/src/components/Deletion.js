import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import "../css/deletion.css";

export default function Deletion() {
  const { wordSetId } = useParams();
  const navigate = useNavigate();
  const api = useAxios();

  const handleCancel = () => {
    navigate(`/word-sets/${wordSetId}`);
  };

  const handleDelete = () => {
    api
      .delete(`/word-sets/${wordSetId}/delete`)
      .then((response) => {
        alert("Word set has been deleted successfully!");
        navigate("/word-sets");
      })
      .catch((error) => alert("Something went wrong!"));
  };

  useEffect(() => {
    document.title = "Delete word set";
  }, []);

  return (
    <div className="deletion">
      <h1 className="deletion--title">
        Are you sure you want to delete this word set?
      </h1>
      <div className="deletion--buttons">
        <button className="deletion--buttons--cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="deletion--buttons--delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
