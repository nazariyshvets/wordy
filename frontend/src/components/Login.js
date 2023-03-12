import React, { useState, useContext, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/loginRegistration.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { user, loginUser } = useContext(AuthContext);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    loginUser(formData.username, formData.password);
  };

  useEffect(() => {
    document.title = "Authorization";
  }, []);

  return (
    <div className="login">
      {user && <Navigate to="/word-sets" replace={true} />}

      <h1 className="login--title">Login</h1>
      <form className="login--form" title="" onSubmit={handleSubmit}>
        <input
          className="login--form--input"
          name="username"
          placeholder="Username"
          value={formData.username}
          required
          maxLength={150}
          onChange={handleChange}
        />
        <input
          type="password"
          className="login--form--input"
          name="password"
          placeholder="Password"
          value={formData.password}
          required
          minLength={8}
          onChange={handleChange}
        />
        <button className="form--button">Log In</button>
      </form>
      <p className="login--registration">
        Don't have an account?{" "}
        <Link
          to="/registration"
          className="login--registration--link"
          draggable={false}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}
