import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { useAlert } from "react-alert";
import jwt_decode from "jwt-decode";
import useTr from "../hooks/useTr";
import { AuthContextTr } from "../translations/miscTr";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";

interface AuthTokens {
  access: string;
  refresh: string;
}

interface User {
  exp: number;
  iat: number;
  jti: string;
  token_type: "access";
  user_id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  authTokens: AuthTokens | null;
  setAuthTokens: Dispatch<SetStateAction<AuthTokens | null>>;
  registerUser: (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });
  const [user, setUser] = useState<User | null>(
    authTokens ? jwt_decode(authTokens.access) : null
  );
  const alert = useAlert();
  const { langCode } = useTr();

  async function registerUser(
    username: string,
    email: string,
    password: string,
    password2: string
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
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
          resolve();
        } else {
          const error = await response.json();

          if (error.username) {
            alert.error(AuthContextTr.signupUsernameError[langCode]);
          } else if (error.email) {
            alert.error(AuthContextTr.signupEmailError[langCode]);
          } else if (error.password) {
            alert.error(AuthContextTr.signupPasswordError[langCode]);
          } else {
            alert.error(AuthContextTr.somethingWentWrong[langCode]);
          }

          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async function loginUser(username: string, password: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
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
          resolve();
        } else {
          alert.error(AuthContextTr.loginError[langCode]);
          reject(AuthContextTr.loginError[langCode]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function logoutUser() {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
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

export { AuthContext, AuthProvider, AuthTokens, User, AuthContextType };
