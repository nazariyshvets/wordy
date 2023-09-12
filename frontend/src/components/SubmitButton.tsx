import "../css/SubmitButton.css";

interface SubmitButtonProps {
  text: string;
}

function SubmitButton({ text }: SubmitButtonProps) {
  return (
    <button type="submit" className="submit-button">
      {text}
    </button>
  );
}

export default SubmitButton;
