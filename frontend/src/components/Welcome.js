import React, { useContext, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/welcome.css";

export default function Welcome() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Welcome";
  }, []);

  return (
    <div className="welcome">
      {user && <Navigate to="/word-sets" replace={true} />}

      <h1 className="welcome--title">Welcome!</h1>
      <p className="welcome--desc">
        <i className="welcome--desc--brand" translate="no">
          Wordy
        </i>{" "}
        is a platform which can help you in your words learning
      </p>
      <div className="welcome--links">
        <Link className="welcome--links--login" to="/login" draggable={false}>
          Log In
        </Link>
        <Link
          className="welcome--links--signup"
          to="/registration"
          draggable={false}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
