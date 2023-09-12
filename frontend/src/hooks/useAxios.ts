import { Dispatch, SetStateAction } from "react";
import axios, { InternalAxiosRequestConfig } from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { AuthTokens, User } from "contexts/AuthContext";
import useAuth from "./useAuth";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";

const axiosInstance = axios.create({ baseURL: BASE_SERVER_URL + "/api" });

async function refreshTokenAndHeaders(
  authTokens: AuthTokens | null,
  setAuthTokens: Dispatch<SetStateAction<AuthTokens | null>>,
  user: User | null,
  setUser: Dispatch<SetStateAction<User | null>>,
  logoutUser: () => void,
  req: InternalAxiosRequestConfig
) {
  if (!authTokens || !user) {
    return Promise.resolve(req);
  }

  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    return Promise.resolve(req);
  }

  try {
    const response = await axios.post(`${BASE_SERVER_URL}/api/token/refresh/`, {
      refresh: authTokens.refresh,
    });
    const data = response.data;
    const tokens = { access: data.access, refresh: authTokens.refresh };

    localStorage.setItem("authTokens", JSON.stringify(tokens));
    setAuthTokens(tokens);
    setUser(jwt_decode(tokens.access));
    req.headers = req.headers ?? {};
    req.headers.Authorization = `Bearer ${tokens.access}`;
    return req;
  } catch (error) {
    console.error(error);
    logoutUser();
    return await Promise.reject(error);
  }
}

function useAxios() {
  const { authTokens, setAuthTokens, user, setUser, logoutUser } = useAuth();

  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authTokens?.access}`;
  axiosInstance.interceptors.request.use((req) =>
    refreshTokenAndHeaders(
      authTokens,
      setAuthTokens,
      user,
      setUser,
      logoutUser,
      req
    )
  );

  return axiosInstance;
}

export default useAxios;
