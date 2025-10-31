import { useCallback, useEffect, useRef } from "react";

export const useCarouselScroll = (target: React.RefObject<HTMLElement>) => {
  const x = useRef<number>(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onMouseUp = useCallback(() => {
    if (!target.current) return;

    // eslint-disable-next-line react-hooks/immutability
    target.current.style.removeProperty("scroll-behavior");
    // eslint-disable-next-line react-hooks/immutability
    target.current.style.removeProperty("scroll-snap-type");
    // eslint-disable-next-line react-hooks/immutability
    target.current.style.removeProperty("pointer-events");

    window.removeEventListener("mousemove", onMouseMove as EventListener);
    window.removeEventListener("mouseup", onMouseUp as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      if (!target.current) return;

      // eslint-disable-next-line react-hooks/immutability
      target.current.style.pointerEvents = "none";

      const delta = e.pageX - x.current;
      x.current = e.pageX;

      target.current.scrollBy(-delta, 0);
    },
    [target]
  );

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!target.current) return;

      // eslint-disable-next-line react-hooks/immutability
      target.current.style.scrollSnapType = "none";
      // eslint-disable-next-line react-hooks/immutability
      target.current.style.scrollBehavior = "auto";

      x.current = e.pageX;

      window.addEventListener("mousemove", onMouseMove as EventListener);
      window.addEventListener("mouseup", onMouseUp as EventListener);
    },
    [onMouseMove, onMouseUp, target]
  );

  useEffect(() => {
    const element = target.current;

    if (!element) return;

    element.addEventListener("mousedown", onMouseDown as EventListener);

    return () => {
      element.removeEventListener("mousedown", onMouseDown as EventListener);
    };
  }, [onMouseDown, target]);
};
