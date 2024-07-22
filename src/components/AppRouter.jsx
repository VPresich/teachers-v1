import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const Teachers = lazy(() => import("../pages/Teachers/Teachers"));
const Favorites = lazy(() => import("../pages/Favorites/Favorites"));
import Loader from "../components/UI/Loader/Loader";
import PrivateRoute from "./PrivateRoute";

function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route
          path="/favorites"
          element={<PrivateRoute redirectTo="/" component={<Favorites />} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
