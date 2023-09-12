import useTr from "../hooks/useTr";
import { SkipTr } from "../translations/componentsTr";
import "../css/Skip.css";

interface SkipProps {
  onClick: () => void;
}

function Skip({ onClick }: SkipProps) {
  const { langCode } = useTr();

  return (
    <div className="skip" onClick={onClick}>
      {SkipTr.skip[langCode]}
    </div>
  );
}

export default Skip;
