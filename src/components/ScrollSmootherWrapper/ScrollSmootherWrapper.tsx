import { useRef, type ReactNode, type FC } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

interface ScrollSmootherWrapperProps {
  children: ReactNode;
}

const ScrollSmootherWrapper: FC<ScrollSmootherWrapperProps> = ({ children }) => {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useGSAP(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
    });

    (window as any).ScrollSmoother = ScrollSmoother;

    return () => {
      smootherRef.current?.kill();
      delete (window as any).ScrollSmoother;
    };
  });

  return (
    <div id="smooth-wrapper" className="fixed top-0 left-0 w-full h-full overflow-hidden">
      <div id="smooth-content" className="absolute top-0 left-0 w-full will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default ScrollSmootherWrapper;
