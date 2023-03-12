import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import modesData, { MODES } from "../utils/modesData";
import "./css/general.css";
import Welcome from "./Welcome";
import Registration from "./Registration";
import Login from "./Login";
import Main from "./Main";
import WordSetsIndex from "./WordSetsIndex";
import CreationUpdating from "./CreationUpdating";
import WordSet from "./WordSet";
import DefaultFlashcards from "./DefaultFlashcards";
import Deletion from "./Deletion";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            <AuthProvider>
              <Welcome />
            </AuthProvider>
          }
        />
        <Route
          path="/registration"
          element={
            <AuthProvider>
              <Registration />
            </AuthProvider>
          }
        />
        <Route
          path="/login"
          element={
            <AuthProvider>
              <Login />
            </AuthProvider>
          }
        />
        <Route
          path="/word-sets"
          element={
            <AuthProvider>
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            </AuthProvider>
          }>
          <Route index element={<WordSetsIndex />} />
          <Route
            path="create"
            element={<CreationUpdating mode={MODES.CREATION} />}
          />
          <Route path=":wordSetId" element={<WordSet />}>
            <Route index element={<DefaultFlashcards />} />
            {modesData.map((mode) => (
              <Route path={`${mode.id}`} element={mode.element} key={mode.id} />
            ))}
          </Route>
          <Route
            path=":wordSetId/update"
            element={<CreationUpdating mode={MODES.UPDATING} />}
          />
          <Route path=":wordSetId/delete" element={<Deletion />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}
