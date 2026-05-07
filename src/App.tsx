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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to content
      </a>
      <AppHeader />
      <ScrollSmootherWrapper>
        <main id="main-content" className="bg-background min-h-[calc(100dvh-3.5rem)] pt-14">
          <ErrorBoundary>
            <Routes>
              {routes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))}
            </Routes>
          </ErrorBoundary>
        </main>
        <AppFooter />
      </ScrollSmootherWrapper>
    </div>
  );
}

export default App;
