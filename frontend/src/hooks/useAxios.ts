import { useRef, useEffect } from "react";
import axios, { InternalAxiosRequestConfig } from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { AuthTokens, User } from "contexts/AuthContext";
import useAuth from "./useAuth";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";

const axiosInstance = axios.create({ baseURL: BASE_SERVER_URL + "/api" });

let isInterceptorAdded = false;
let refreshPromise: Promise<any> | null = null;
let refreshCallbacks: ((tokens: AuthTokens) => void)[] = [];

async function refreshTokenAndHeaders(
  authTokens: AuthTokens | null,
  setAuthTokens: (tokens: AuthTokens | null) => void,
  user: User | null,
  setUser: (user: User | null) => void,
  req: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  if (!authTokens || !user) {
    return req;
  }

  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    return req;
  }

  // Check if there is an existing refreshPromise
  if (!refreshPromise) {
    // Create a new promise for token refresh
    try {
      refreshPromise = axios.post(`${BASE_SERVER_URL}/api/token/refresh/`, {
        refresh: authTokens.refresh,
      });
      const response = await refreshPromise;
      const data = response.data;
      const tokens = { access: data.access, refresh: authTokens.refresh };

      // Update auth tokens and user
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      setAuthTokens(tokens);
      setUser(jwt_decode(tokens.access));

      // Update request headers
      req.headers = req.headers ?? {};
      req.headers["Authorization"] = `Bearer ${tokens.access}`;

      // Execute all waiting callbacks with the updated tokens
      refreshCallbacks.forEach((callback) => callback(tokens));
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    } finally {
      // Reset refreshPromise and callbacks after completion
      refreshPromise = null;
      refreshCallbacks = [];
    }
  } else {
    return new Promise<InternalAxiosRequestConfig>((resolve) => {
      const callback = (tokens: AuthTokens) => {
        // Update request headers with the new access token
        req.headers = req.headers ?? {};
        req.headers["Authorization"] = `Bearer ${tokens.access}`;
        resolve(req);
      };

      refreshCallbacks.push(callback);
    });
  }

  return req;
}

function useAxios() {
  const { authTokens, setAuthTokens, user, setUser, logoutUser } = useAuth();
  const authTokensRef = useRef(authTokens);
  const userRef = useRef(user);

  // Update refs when context values change
  useEffect(() => {
    authTokensRef.current = authTokens;
    userRef.current = user;
  }, [authTokens, user]);

  useEffect(() => {
    // Add interceptor only once
    if (!isInterceptorAdded) {
      axiosInstance.interceptors.request.use(
        async (req: InternalAxiosRequestConfig) => {
          try {
            return await refreshTokenAndHeaders(
              authTokensRef.current,
              setAuthTokens,
              userRef.current,
              setUser,
              req
            );
          } catch (error) {
            logoutUser();
            return Promise.reject(req);
          }
        }
      );
      isInterceptorAdded = true;
    }
  }, [authTokens, user, setAuthTokens, setUser, logoutUser]);

  // Set default authorization header with the access token
  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authTokens?.access}`;

  return axiosInstance;
}

export default useAxios;
