import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
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

const router = createBrowserRouter([
  {
    element: (
      <TrProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </TrProvider>
    ),
    children: [
      { path: "/", element: <WelcomePage /> },
      { path: "/registration", element: <RegistrationPage /> },
      { path: "/login", element: <LoginPage /> },
      {
        path: "/word-sets",
        element: (
          <PrivatePage>
            <MainPage />
          </PrivatePage>
        ),
        children: [
          { index: true, element: <HomePage /> },
          {
            path: "create",
            element: <CreateUpdateWordSetPage isCreating={true} />,
          },
          {
            path: ":wordSetId",
            element: <WordSetPage />,
            children: [
              { index: true, element: <DefaultModePage /> },
              ...MODES.map((mode) => ({
                path: mode.id,
                element: mode.element,
              })),
            ],
          },
          {
            path: ":wordSetId/update",
            element: <CreateUpdateWordSetPage isCreating={false} />,
          },
          { path: ":wordSetId/delete", element: <DeleteWordSetPage /> },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/word-sets" replace />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
