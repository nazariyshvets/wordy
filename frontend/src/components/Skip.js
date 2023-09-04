import useTr from "../hooks/useTr";
import { SkipTr } from "../translations/componentsTr";
import "../css/Skip.css";

function Skip({ onClick }) {
  const { langCode } = useTr();

  return (
    <div className="skip" onClick={onClick}>
      {SkipTr.skip[langCode]}
    </div>
  );
}

export default Skip;
