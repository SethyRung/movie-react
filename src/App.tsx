import { Route, Routes } from "react-router-dom";
import AppHeader from "@components/AppHeader";
import AppFooter from "@components/AppFooter";
import ScrollSmootherWrapper from "./components/ScrollSmootherWrapper";
import { routes } from "./routes";

function App() {
  return (
    <div className="relative">
      <AppHeader />
      <ScrollSmootherWrapper>
        <div className="pt-14 bg-tertiary-500">
          <Routes>
            {routes.map((route) => (
              <Route path={route.path} element={route.element} key={route.path} />
            ))}
          </Routes>
        </div>
        <AppFooter />
      </ScrollSmootherWrapper>
    </div>
  );
}

export default App;
