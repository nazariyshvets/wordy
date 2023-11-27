import { useEffect } from "react";
import axios, { InternalAxiosRequestConfig } from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { AuthTokens, User } from "contexts/AuthContext";
import useAuth from "./useAuth";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";
import CustomError from "interfaces/CustomError.interface";

class AbortedRequestError extends Error implements CustomError {
  code?: string;

  constructor(message: string) {
    super(message);
    this.name = "AbortedRequestError";
    this.code = "ERR_CANCELED";
  }
}

const axiosInstance = axios.create({ baseURL: BASE_SERVER_URL + "/api" });

let isInterceptorAdded = false;
let requestQueue: ((value: InternalAxiosRequestConfig) => void)[] = [];
let refreshLock = false;

async function refreshTokenAndHeaders(
  authTokens: AuthTokens | null,
  setAuthTokens: (tokens: AuthTokens | null) => void,
  user: User | null,
  setUser: (user: User | null) => void,
  logoutUser: () => void,
  req: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  // Check if the request has been aborted
  if (req.signal && req.signal.aborted) {
    throw new AbortedRequestError("Request aborted");
  }

  if (!authTokens || !user) {
    return req;
  }

  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    return req;
  }

  // Queue the request if a refresh is already in progress
  if (refreshLock) {
    return new Promise<InternalAxiosRequestConfig>((resolve) => {
      requestQueue.push(resolve);
    });
  }

  try {
    refreshLock = true;

    // Perform token refresh
    const response = await axios.post(`${BASE_SERVER_URL}/api/token/refresh/`, {
      refresh: authTokens.refresh,
    });
    const data = response.data;
    const tokens = { access: data.access, refresh: authTokens.refresh };

    // Update auth tokens and user
    localStorage.setItem("authTokens", JSON.stringify(tokens));
    setAuthTokens(tokens);
    setUser(jwt_decode(tokens.access));

    // Update request headers with the new access token
    req.headers = req.headers ?? {};
    req.headers["Authorization"] = `Bearer ${tokens.access}`;

    return req;
  } catch (error) {
    console.error("Token refresh error:", error);
    logoutUser();
    throw error;
  } finally {
    refreshLock = false;

    // Process queued requests after the token refresh is completed
    requestQueue.forEach((resolve) => resolve(req));
    requestQueue = [];
  }
}

function useAxios() {
  const { authTokens, setAuthTokens, user, setUser, logoutUser } = useAuth();

  useEffect(() => {
    // Add interceptor only once
    if (!isInterceptorAdded) {
      axiosInstance.interceptors.request.use(
        async (req: InternalAxiosRequestConfig) => {
          try {
            const updatedReq = await refreshTokenAndHeaders(
              authTokens,
              setAuthTokens,
              user,
              setUser,
              logoutUser,
              req
            );

            // Check if the request has been canceled
            if (req.signal && req.signal.aborted) {
              throw new AbortedRequestError("Request aborted");
            }

            return updatedReq;
          } catch (error) {
            return Promise.reject(error);
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
