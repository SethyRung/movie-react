import { Route, Routes } from "react-router-dom";
import { routes } from "@/router";

import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import ScrollSmootherWrapper from "@/components/ScrollSmootherWrapper";

function App() {
  return (
    <div className="relative">
      <AppHeader />
      <ScrollSmootherWrapper>
        <div className="pt-14 bg-background">
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
