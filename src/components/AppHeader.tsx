import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react";
import { NavLink, useLocation } from "react-router-dom";
import { Search } from "@/components/Search";

export default function NavBar() {
  const navItems = [
    {
      to: "/",
      name: "Home",
    },
    {
      to: "/movies",
      name: "Movies",
    },
    {
      to: "/contacts",
      name: "Contacts",
    },
    {
      to: "/about-us",
      name: "About us",
    },
  ];

  const [isNavOpen, setIsNavOpen] = useState(false);
  const route = useLocation();

  useEffect(() => {
    // Close mobile menu when route changes
    if (isNavOpen) {
      setTimeout(() => setIsNavOpen(false), 0);
    }
  }, [route, isNavOpen]);

  useEffect(() => {
    // Close mobile menu when pressing Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isNavOpen) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isNavOpen]);

  return (
    <div className="bg-black fixed top-0 w-full z-1000">
      <div className="h-14 px-4 tablet:px-16 desktop:px-52 flex justify-between items-center">
        <img src="/assets/logo.svg" alt="logo" />
        <ul className="hidden tablet:flex justify-between items-center gap-8 text-white">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  twMerge(
                    "w-full h-10 flex flex-col justify-center items-center gap-1 transition-all hover:text-primary-500 hover:after:w-3/4 hover:after:border-b-2 hover:after:border-b-primary-500",
                    isActive
                      ? "text-primary-500 after:w-3/4 after:border-b-2 after:border-b-primary-500"
                      : ""
                  )
                }>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden tablet:block">
          <Search
            placeholder="Search here"
            className="w-56"
            size="sm"
            onSearch={(query) => {
              // TODO: Implement search functionality
              console.log("Search query:", query);
            }}
          />
        </div>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="tablet:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
          aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isNavOpen}>
          {isNavOpen ? (
            <Icon icon="mdi-close" width="24" color="white" />
          ) : (
            <Icon icon="mdi-menu" width="24" color="white" />
          )}
        </button>
      </div>
      {isNavOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[999] tablet:hidden transition-opacity duration-300"
            onClick={() => setIsNavOpen(false)}
            aria-label="Close mobile menu"
          />

          {/* Mobile menu */}
          <div className="fixed top-14 left-0 right-0 bg-tertiary-500 shadow-lg z-[1000] tablet:hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto transition-transform duration-300 ease-out">
            <div className="px-4 py-4">
              <Search
                placeholder="Search here"
                className="w-full"
                size="sm"
                onSearch={(query) => {
                  // TODO: Implement search functionality
                  console.log("Mobile search query:", query);
                }}
              />
            </div>
            <nav aria-label="Mobile navigation">
              <ul className="py-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setIsNavOpen(false)}
                      className={({ isActive }) =>
                        twMerge(
                          "w-full h-12 flex justify-center items-center text-white text-center transition-colors hover:bg-white/10",
                          isActive ? "text-primary-500 bg-primary-500/10" : ""
                        )
                      }>
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
