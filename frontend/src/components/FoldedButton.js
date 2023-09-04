import "../css/FoldedButton.css";

function FoldedButton({ text, onClick }) {
  return (
    <button type="button" className="folded-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default FoldedButton;
