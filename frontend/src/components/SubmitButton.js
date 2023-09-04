import "../css/SubmitButton.css";

function SubmitButton({ text, onClick }) {
  return (
    <button type="submit" className="submit-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default SubmitButton;
