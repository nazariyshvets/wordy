import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import App from "./components/App";
import AlertTemplate from "./components/AlertTemplate";
import "./firebaseConfig";
import "./css/general.css";

const alertOptions = {
  offset: "10px",
  position: positions.TOP_CENTER,
  timeout: 5000,
  transition: transitions.SCALE,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <App />
    </AlertProvider>
  </StrictMode>
);
