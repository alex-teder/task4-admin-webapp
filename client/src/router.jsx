import { createBrowserRouter, redirect } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { UsersPage } from "./pages/UsersPage";
import { getUser } from "./utils/storageUtils";

export const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  USERS: "/users",
};

const checkUser = () => !!getUser().token;
const protectAuthOnly = () => (checkUser() ? null : redirect(PATHS.LOGIN));
const protectNoAuthOnly = () => (checkUser() ? redirect(PATHS.USERS) : null);

export const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    loader() {
      if (checkUser()) return redirect(PATHS.USERS);
      return redirect(PATHS.LOGIN);
    },
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
    loader: protectNoAuthOnly,
  },
  {
    path: PATHS.SIGNUP,
    element: <SignupPage />,
    loader: protectNoAuthOnly,
  },
  {
    path: PATHS.USERS,
    element: <UsersPage />,
    loader: protectAuthOnly,
  },
]);
