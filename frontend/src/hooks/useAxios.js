import { useContext } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { AuthContext } from "../contexts/AuthContext";
import BASE_SERVER_URL from "../constants/BASE_SERVER_URL";

const axiosInstance = axios.create({ baseURL: BASE_SERVER_URL + "/api" });

function refreshTokenAndHeaders(
  authTokens,
  setAuthTokens,
  setUser,
  logoutUser,
  req
) {
  const user = jwt_decode(authTokens.access);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

  if (!isExpired) {
    return req;
  }

  return axios
    .post(`${BASE_SERVER_URL}/api/token/refresh/`, {
      refresh: authTokens.refresh,
    })
    .then((response) => {
      const data = response.data;
      const tokens = { access: data.access, refresh: authTokens.refresh };

      localStorage.setItem("authTokens", JSON.stringify(tokens));
      setAuthTokens(tokens);
      setUser(jwt_decode(tokens.access));
      req.headers.Authorization = `Bearer ${tokens.access}`;
      return req;
    })
    .catch((error) => {
      console.error(error);
      logoutUser();
    });
}

function useAxios() {
  const { authTokens, setUser, setAuthTokens, logoutUser } =
    useContext(AuthContext);

  axiosInstance.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${authTokens.access}`;
  axiosInstance.interceptors.request.use((req) =>
    refreshTokenAndHeaders(authTokens, setAuthTokens, setUser, logoutUser, req)
  );

  return axiosInstance;
}

export default useAxios;
