import useTr from "../hooks/useTr";
import { RestartButtonTr } from "../translations/componentsTr";
import "../css/RestartButton.css";

interface RestartButtonProps {
  onClick: () => void;
}

function RestartButton({ onClick }: RestartButtonProps) {
  const { langCode } = useTr();

  return (
    <button className="restart-button" onClick={onClick}>
      {RestartButtonTr.restart[langCode]}
    </button>
  );
}

export default RestartButton;
