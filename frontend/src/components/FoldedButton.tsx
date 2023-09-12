import "../css/FoldedButton.css";

interface FoldedButtonProps {
  text: string;
  onClick: () => void;
}

function FoldedButton({ text, onClick }: FoldedButtonProps) {
  return (
    <button type="button" className="folded-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default FoldedButton;
