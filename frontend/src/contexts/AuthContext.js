import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import jwt_decode from "jwt-decode";
import useTr from "../hooks/useTr";
import { AuthContextTr } from "../translations/miscTr";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(
    JSON.parse(localStorage.getItem("authTokens")) || null
  );
  const [user, setUser] = useState(
    authTokens ? jwt_decode(authTokens.access) : null
  );
  const alert = useAlert();
  const { langCode } = useTr();
  const navigate = useNavigate();

  async function registerUser(username, email, password, password2) {
    const response = await fetch(`${BASE_SERVER_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password2,
      }),
    });

    if (response.status === 201) {
      navigate("/login");
    } else {
      const error = await response.json();
      console.error(error);

      if (error.username) {
        alert.error(AuthContextTr.signupUsernameError[langCode]);
      } else if (error.email) {
        alert.error(AuthContextTr.signupEmailError[langCode]);
      } else if (error.password) {
        alert.error(AuthContextTr.signupPasswordError[langCode]);
      } else {
        alert.error(AuthContextTr.somethingWentWrong[langCode]);
      }
    }
  }

  async function loginUser(username, password) {
    const response = await fetch(`${BASE_SERVER_URL}/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      navigate("/word-sets");
    } else {
      console.error(data.detail);
      alert.error(AuthContextTr.loginError[langCode]);
    }
  }

  function logoutUser() {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  }

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
