import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import PageTitle from "../components/PageTitle";
import useAxios from "../hooks/useAxios";
import useDocumentTitle from "../hooks/useDocumentTitle";
import useTr from "../hooks/useTr";
import { DeleteWordSetPageTr } from "../translations/pagesTr";
import "../css/DeleteWordSetPage.css";

function DeleteWordSetPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { wordSetId } = useParams();
  const { langCode } = useTr();
  const alert = useAlert();
  const api = useAxios();
  const navigate = useNavigate();

  useDocumentTitle(DeleteWordSetPageTr.title[langCode]);

  function handleCancel() {
    navigate(`/word-sets/${wordSetId}`);
  }

  function handleDelete() {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);

    api
      .delete(`/word-sets/${wordSetId}/delete/`)
      .then(() => {
        alert.success(DeleteWordSetPageTr.deleted[langCode]);
        navigate("/word-sets");
      })
      .catch((error) => {
        console.error(error);
        alert.error(DeleteWordSetPageTr.somethingWentWrong[langCode]);
      })
      .finally(() => setIsProcessing(false));
  }

  return (
    <div className="delete-word-set-page">
      <PageTitle text={DeleteWordSetPageTr.confirmAction[langCode]} />

      <div className="delete-word-set-page--buttons">
        <button className="delete-word-set-page--cancel" onClick={handleCancel}>
          {DeleteWordSetPageTr.cancel[langCode]}
        </button>
        <button className="delete-word-set-page--delete" onClick={handleDelete}>
          {DeleteWordSetPageTr.delete[langCode]}
        </button>
      </div>
    </div>
  );
}

export default DeleteWordSetPage;
