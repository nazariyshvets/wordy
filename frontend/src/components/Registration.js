import React, { useState, useContext, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/loginRegistration.css";

export default function Registration() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const { user, registerUser } = useContext(AuthContext);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    registerUser(
      formData.username,
      formData.email,
      formData.password,
      formData.password2
    );
  };

  useEffect(() => {
    document.title = "Registration";
  }, []);

  return (
    <div className="registration">
      {user && <Navigate to="/word-sets" replace={true} />}

      <h1 className="registration--title">Registration</h1>
      <form
        className="registration--form"
        title=""
        autoComplete="off"
        onSubmit={handleSubmit}>
        <input
          className="registration--form--input"
          name="username"
          placeholder="Username"
          value={formData.username}
          required
          maxLength={150}
          onChange={handleChange}
        />
        <input
          type="email"
          className="registration--form--input"
          name="email"
          placeholder="Email"
          value={formData.email}
          required
          maxLength={320}
          onChange={handleChange}
        />
        <input
          type="password"
          className="registration--form--input"
          name="password"
          placeholder="Password"
          value={formData.password}
          required
          minLength={8}
          onChange={handleChange}
        />
        <input
          type="password"
          className="registration--form--input"
          name="password2"
          placeholder="Confirm password"
          value={formData.password2}
          required
          minLength={8}
          onChange={handleChange}
        />
        <button className="form--button">Sign Up</button>
      </form>
      <p className="registration--login">
        Already on Wordy?{" "}
        <Link
          to="/login"
          className="registration--login--link"
          draggable={false}>
          Log In
        </Link>
      </p>
    </div>
  );
}
