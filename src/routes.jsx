import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import { getItem } from "./utils/storage";

function NonPrivateRoutes({ redirectTo }) {
  const isAuthenticated = getItem("token");

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function PrivateRoutes({ redirectTo }) {
  const isAuthenticated = getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<NonPrivateRoutes redirectTo={"/"} />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
      <Route element={<PrivateRoutes redirectTo={"/sign-in"} />}>
        <Route path="/" element={<Main />} />
      </Route>
    </Routes>
  );
}
