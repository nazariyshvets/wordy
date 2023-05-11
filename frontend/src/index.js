import ReactDOM from "react-dom/client";
import App from "./components/App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyATeNRcVUiVrhaSPei2S5AzcM20Xnc1FPs",
  authDomain: "wordy-16943.firebaseapp.com",
  projectId: "wordy-16943",
  storageBucket: "wordy-16943.appspot.com",
  messagingSenderId: "1010639691421",
  appId: "1:1010639691421:web:a180d22d72122563ea3e74",
  measurementId: "G-3Q3EY44ELH",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
