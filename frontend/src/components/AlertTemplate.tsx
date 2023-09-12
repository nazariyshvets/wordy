import { AlertTemplateProps } from "react-alert";
import "../css/AlertTemplate.css";

function AlertTemplate({ style, options, message, close }: AlertTemplateProps) {
  const type = options.type || "info";

  return (
    <div className={`alert-template ${type}`} style={style}>
      <div className={`alert-template--icon-wrapper ${type}`}>
        {type === "info" && <i className="fa fa-solid fa-circle-info"></i>}
        {type === "success" && <i className="fa fa-solid fa-circle-check"></i>}
        {type === "error" && (
          <i className="fa fa-solid fa-circle-exclamation"></i>
        )}
      </div>

      <p className={`alert-template--message ${type}`}>{message}</p>

      <button className="alert-template--close" onClick={close}>
        &#10006;
      </button>
    </div>
  );
}

export default AlertTemplate;
