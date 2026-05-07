import { Route, Routes } from "react-router-dom";
import { routes } from "@/router";

import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import ScrollSmootherWrapper from "@/components/ScrollSmootherWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";

function App() {
  useScrollToTop();

  return (
    <div className="relative">
      <AppHeader />
      <ScrollSmootherWrapper>
        <div className="bg-background min-h-[calc(100dvh-3.5rem)]">
          <ErrorBoundary>
            <Routes>
              {routes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))}
            </Routes>
          </ErrorBoundary>
        </div>
        <AppFooter />
      </ScrollSmootherWrapper>
    </div>
  );
}

export default App;
