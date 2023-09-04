import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import useTr from "../hooks/useTr";
import { InteractiveAnswerFormTr } from "../translations/componentsTr";
import "../css/InteractiveAnswerForm.css";

function InteractiveAnswerForm({ answer, setAnswer, inProp, onSubmit }) {
  const inputNodeRef = useRef(null);
  const { langCode } = useTr();

  return (
    <form
      className="interactive-answer-form"
      autoComplete="off"
      title=""
      onSubmit={onSubmit}
    >
      <CSSTransition
        nodeRef={inputNodeRef}
        in={inProp}
        timeout={1000}
        classNames="interactive-answer-form--input"
      >
        <input
          className="interactive-answer-form--input"
          ref={inputNodeRef}
          value={answer}
          placeholder={InteractiveAnswerFormTr.typeAnswer[langCode]}
          onChange={(event) => setAnswer(event.target.value)}
        />
      </CSSTransition>

      <button type="submit" className="interactive-answer-form--send">
        <i className="fa fa-solid fa-right-long"></i>
      </button>
    </form>
  );
}

export default InteractiveAnswerForm;
