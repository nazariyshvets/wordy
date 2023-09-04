import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { TrProvider } from "../contexts/TrContext";
import MODES from "../constants/MODES";
import WelcomePage from "../pages/WelcomePage";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import HomePage from "../pages/HomePage";
import CreateUpdateWordSetPage from "../pages/CreateUpdateWordSetPage";
import WordSetPage from "../pages/WordSetPage";
import DefaultModePage from "../pages/DefaultModePage";
import DeleteWordSetPage from "../pages/DeleteWordSetPage";
import PrivatePage from "../pages/PrivatePage";

function App() {
  return (
    <BrowserRouter>
      <TrProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/word-sets"
              element={
                <PrivatePage>
                  <MainPage />
                </PrivatePage>
              }
            >
              <Route index element={<HomePage />} />
              <Route
                path="create"
                element={<CreateUpdateWordSetPage isCreating={true} />}
              />
              <Route path=":wordSetId" element={<WordSetPage />}>
                <Route index element={<DefaultModePage />} />
                {MODES.map((mode) => (
                  <Route
                    path={`${mode.id}`}
                    element={mode.element}
                    key={mode.id}
                  />
                ))}
              </Route>
              <Route
                path=":wordSetId/update"
                element={<CreateUpdateWordSetPage isCreating={false} />}
              />
              <Route path=":wordSetId/delete" element={<DeleteWordSetPage />} />
            </Route>
            <Route
              path="*"
              element={<Navigate to="/word-sets" replace={true} />}
            />
          </Routes>
        </AuthProvider>
      </TrProvider>
    </BrowserRouter>
  );
}

export default App;
