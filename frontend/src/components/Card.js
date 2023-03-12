import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "../css/card.css";

export default function Card(props) {
  const [isBackSide, setIsBackSide] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const cardNodeRef = useRef(null);

  const handleFlip = () => {
    if (canFlip) {
      setCanFlip(false);
      setIsBackSide((prevIsBackSide) => !prevIsBackSide);
    }
  };

  const allowFlip = () => {
    setCanFlip(true);
  };

  return (
    <CSSTransition
      nodeRef={cardNodeRef}
      in={isBackSide}
      timeout={1000}
      classNames="card"
      onEntered={allowFlip}
      onExited={allowFlip}>
      <div className="card" ref={cardNodeRef} onClick={handleFlip}>
        <h1 className="card--front" translate="no">
          {props.frontText}
        </h1>
        <h1 className="card--back" translate="no">
          {props.backText}
        </h1>
      </div>
    </CSSTransition>
  );
}
