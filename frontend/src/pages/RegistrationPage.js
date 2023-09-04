import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import SubmitButton from "../components/SubmitButton";
import useAuth from "../hooks/useAuth";
import useTr from "../hooks/useTr";
import { RegistrationPageTr } from "../translations/pagesTr";
import useDocumentTitle from "../hooks/useDocumentTitle";
import Footer from "../components/Footer";
import "../css/LoginRegistrationPage.css";

function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const { user, registerUser } = useAuth();
  const { langCode } = useTr();

  useDocumentTitle(RegistrationPageTr.title[langCode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    registerUser(
      formData.username,
      formData.email,
      formData.password,
      formData.password2
    );
  }

  return (
    <div className="registration-page">
      {user && <Navigate to="/word-sets" replace={true} />}

      <PageTitle text={RegistrationPageTr.title[langCode]} />

      <form
        className="registration-page--form"
        title=""
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="registration-page--form--input"
          name="username"
          value={formData.username}
          placeholder={RegistrationPageTr.username[langCode]}
          maxLength={150}
          required
          onChange={handleChange}
        />
        <input
          type="email"
          className="registration-page--form--input"
          name="email"
          value={formData.email}
          placeholder={RegistrationPageTr.email[langCode]}
          maxLength={320}
          required
          onChange={handleChange}
        />
        <input
          type="password"
          className="registration-page--form--input"
          name="password"
          value={formData.password}
          placeholder={RegistrationPageTr.password[langCode]}
          minLength={8}
          required
          onChange={handleChange}
        />
        <input
          type="password"
          className="registration-page--form--input"
          name="password2"
          value={formData.password2}
          placeholder={RegistrationPageTr.password2[langCode]}
          minLength={8}
          required
          onChange={handleChange}
        />
        <SubmitButton text={RegistrationPageTr.signUp[langCode]} />
      </form>

      <p className="registration-page--login">
        {RegistrationPageTr.registered[langCode]}&nbsp;
        <Link
          to="/login"
          className="registration-page--login--link"
          draggable={false}
        >
          {RegistrationPageTr.logIn[langCode]}
        </Link>
      </p>

      <Footer />
    </div>
  );
}

export default RegistrationPage;
