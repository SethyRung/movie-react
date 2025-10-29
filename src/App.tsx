import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/default";
import { routes } from "./routes";

function App() {
  return (
    <DefaultLayout>
      <Routes>
        {routes.map((route) => (
          <Route path={route.path} element={route.element} key={route.path} />
        ))}
      </Routes>
    </DefaultLayout>
  );
}

export default App;
