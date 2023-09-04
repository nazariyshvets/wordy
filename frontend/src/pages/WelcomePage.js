import { Link, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useTr from "../hooks/useTr";
import { WelcomePageTr } from "../translations/pagesTr";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Footer from "../components/Footer";
import "../css/WelcomePage.css";

function WelcomePage() {
  const { user } = useAuth();
  const { langCode } = useTr();

  useDocumentTitle(WelcomePageTr.title[langCode]);

  return (
    <div className="welcome-page">
      {user && <Navigate to="/word-sets" replace={true} />}

      <h1 className="welcome-page--title">{WelcomePageTr.title[langCode]}!</h1>
      <p className="welcome-page--desc">
        <i className="welcome-page--desc--brand">Wordy</i>&nbsp;
        {WelcomePageTr.desc[langCode]}
      </p>

      <div className="welcome-page--links">
        <Link
          to="/login"
          className="welcome-page--links--login"
          draggable={false}
        >
          {WelcomePageTr.logIn[langCode]}
        </Link>
        <Link
          to="/registration"
          className="welcome-page--links--signup"
          draggable={false}
        >
          {WelcomePageTr.signUp[langCode]}
        </Link>
      </div>

      <Footer />
    </div>
  );
}

export default WelcomePage;
