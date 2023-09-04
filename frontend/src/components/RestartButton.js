import useTr from "../hooks/useTr";
import { RestartButtonTr } from "../translations/componentsTr";
import "../css/RestartButton.css";

function RestartButton({ onClick }) {
  const { langCode } = useTr();

  return (
    <button className="restart-button" onClick={onClick}>
      {RestartButtonTr.restart[langCode]}
    </button>
  );
}

export default RestartButton;
