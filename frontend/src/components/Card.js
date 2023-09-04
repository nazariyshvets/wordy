import { useState, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import getFontSizeClass from "../utils/getFontSizeClass";
import "../css/Card.css";

function Card({ frontText, backText }) {
  const [isBackSide, setIsBackSide] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const cardNodeRef = useRef(null);
  const frontTextFontSizeClass = useMemo(
    () => getFontSizeClass(frontText?.length ?? 0),
    [frontText]
  );
  const backTextFontSizeClass = useMemo(
    () => getFontSizeClass(backText?.length ?? 0),
    [backText]
  );

  function handleFlip() {
    if (canFlip) {
      setCanFlip(false);
      setIsBackSide((prevIsBackSide) => !prevIsBackSide);
    }
  }

  function allowFlip() {
    setCanFlip(true);
  }

  return (
    <CSSTransition
      nodeRef={cardNodeRef}
      in={isBackSide}
      timeout={1000}
      classNames="card"
      onEntered={allowFlip}
      onExited={allowFlip}
    >
      <div className="card" ref={cardNodeRef} onClick={handleFlip}>
        <h1 className={`card--front ${frontTextFontSizeClass}`}>{frontText}</h1>
        <h1 className={`card--back ${backTextFontSizeClass}`}>{backText}</h1>
      </div>
    </CSSTransition>
  );
}

export default Card;
