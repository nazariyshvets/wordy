import "../css/LeaveConfirmModal.css";

interface LeaveConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  leaveText: string;
  stayText: string;
  onLeave: () => void;
  onStay: () => void;
}

const LeaveConfirmModal = ({
  isOpen,
  title,
  message,
  leaveText,
  stayText,
  onLeave,
  onStay,
}: LeaveConfirmModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="leave-confirm-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-confirm-title"
      aria-describedby="leave-confirm-message"
    >
      <div className="leave-confirm-modal">
        <h2 id="leave-confirm-title" className="leave-confirm-modal--title">
          {title}
        </h2>
        <p id="leave-confirm-message" className="leave-confirm-modal--message">
          {message}
        </p>
        <div className="leave-confirm-modal--actions">
          <button
            type="button"
            className="leave-confirm-modal--button leave-confirm-modal--button-leave"
            onClick={onLeave}
          >
            {leaveText}
          </button>
          <button
            type="button"
            className="leave-confirm-modal--button leave-confirm-modal--button-stay"
            onClick={onStay}
          >
            {stayText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveConfirmModal;
