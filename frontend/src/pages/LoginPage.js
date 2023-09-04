import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import SubmitButton from "../components/SubmitButton";
import useAuth from "../hooks/useAuth";
import useTr from "../hooks/useTr";
import { LoginPageTr } from "../translations/pagesTr";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Footer from "../components/Footer";
import "../css/LoginRegistrationPage.css";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { user, loginUser } = useAuth();
  const { langCode } = useTr();

  useDocumentTitle(LoginPageTr.title[langCode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    loginUser(formData.username, formData.password);
  }

  return (
    <div className="login-page">
      {user && <Navigate to="/word-sets" replace={true} />}

      <PageTitle text={LoginPageTr.title[langCode]} />

      <form className="login-page--form" title="" onSubmit={handleSubmit}>
        <input
          type="text"
          className="login-page--form--input"
          name="username"
          value={formData.username}
          placeholder={LoginPageTr.username[langCode]}
          maxLength={150}
          required
          onChange={handleChange}
        />
        <input
          type="password"
          className="login-page--form--input"
          name="password"
          value={formData.password}
          placeholder={LoginPageTr.password[langCode]}
          minLength={8}
          required
          onChange={handleChange}
        />
        <SubmitButton text={LoginPageTr.logIn[langCode]} />
      </form>

      <p className="login-page--registration">
        {LoginPageTr.noAccount[langCode]}&nbsp;
        <Link
          to="/registration"
          className="login-page--registration--link"
          draggable={false}
        >
          {LoginPageTr.signUp[langCode]}
        </Link>
      </p>

      <Footer />
    </div>
  );
}

export default LoginPage;
