import { RouteObject } from "react-router-dom";
import HomePage from "@pages/Home";
import { MovieListPage, MovieDetailPage } from "@pages/Movies";
import NotFoundPage from "@pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/movies",
    element: <MovieListPage />,
  },
  {
    path: "/movies/:id",
    element: <MovieDetailPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
