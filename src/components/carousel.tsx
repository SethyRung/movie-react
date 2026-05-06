import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { mergeUI } from "../lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { useResizeObserver } from "usehooks-ts";
import { useScroll } from "@react-hooks-library/core";
import { useCarouselScroll } from "../hooks/useCarouselScroll.ts";

export interface ICarouselUI {
  wrapper?: string;
  container?: string;
  item?: string;
  arrows?: {
    wrapper?: string;
    prevButton?: string;
    nextButton?: string;
  };
  indicators?: {
    wrapper?: string;
    base?: string;
    active?: string;
    inactive?: string;
  };
}

export interface ICarouselRef {
  page: number;
  pages: number;
  prev: () => void;
  next: () => void;
  select: (page: number) => void;
}

export interface ICarouselProps {
  items: string[];
  ui?: ICarouselUI;
  arrows?: boolean;
  prevButton?: {
    label?: string;
    icon?: string;
  };
  nextButton?: {
    label?: string;
    icon?: string;
  };
  indicators?: boolean;
  onPageChange?: (page: number) => void;
  slot: {
    default: (item: string, index: number) => React.JSX.Element;
    prev?: (onClick: () => void, disabled: boolean) => React.JSX.Element;
    next?: (onClick: () => void, disabled: boolean) => React.JSX.Element;
    indicator?: (
      onClick: (page: number) => void,
      page: number,
      active: boolean,
    ) => React.JSX.Element;
  };
}

const Carousel = forwardRef<ICarouselRef, ICarouselProps>(
  (
    { items, ui, arrows = false, prevButton, nextButton, indicators = false, onPageChange, slot },
    ref,
  ) => {
    const defaultUI: ICarouselUI = {
      wrapper: "relative",
      container: "relative w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth",
      item: "flex flex-none snap-center",
      arrows: {
        wrapper: "flex items-center justify-between",
        prevButton:
          "rtl:[&_span:first-child]:rotate-180 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full",
        nextButton:
          "rtl:[&_span:last-child]:rotate-180 absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full",
      },
      indicators: {
        wrapper: "absolute flex items-center justify-center gap-3 bottom-4 inset-x-0",
        base: "rounded-full h-3 w-3",
        active: "bg-primary-500 dark:bg-primary-400",
        inactive: "bg-gray-100 dark:bg-gray-800",
      },
    };

    ui = mergeUI<ICarouselUI>(defaultUI, ui);

    const carouselRef = useRef<HTMLDivElement>(null);
    useCarouselScroll(carouselRef as React.RefObject<HTMLElement>);

    const { width: carouselWidth = 0 } = useResizeObserver({
      ref: carouselRef as React.RefObject<HTMLElement>,
      box: "border-box",
    });

    const itemRef = useRef<HTMLDivElement>(null);
    const { width: itemWidth = 0 } = useResizeObserver({
      ref: itemRef as React.RefObject<HTMLElement>,
      box: "border-box",
    });

    const [x, setX] = useState(0);
    useScroll(carouselRef, ({ scrollX }) => setX(scrollX));

    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
      if (!itemWidth) {
        setCurrentPage(0);
      }
      setCurrentPage(Math.round((x * 10) / 2) + 1);
    }, [itemWidth, x]);

    const [pages, setPages] = useState(0);
    useEffect(() => {
      if (!itemWidth) {
        setPages(0);
      }
      setPages(items.length - Math.round(carouselWidth / itemWidth) + 1);
    }, [itemWidth, carouselWidth, items.length]);

    const isFirst = currentPage <= 1;
    const isLast = currentPage === pages;
    useEffect(() => {
      if (onPageChange) {
        onPageChange(currentPage);
      }
    }, [currentPage, onPageChange]);

    const onClickPrev = useCallback(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ behavior: "smooth", left: -itemWidth });
      }
    }, [itemWidth]);

    const onClickNext = useCallback(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ behavior: "smooth", left: itemWidth });
      }
    }, [itemWidth]);

    const onClick = useCallback(
      (page: number) => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ behavior: "smooth", left: itemWidth * page - itemWidth });
        }
      },
      [itemWidth],
    );

    useImperativeHandle(ref, () => {
      return {
        pages,
        page: currentPage,
        prev: onClickPrev,
        next: onClickNext,
        select: onClick,
      };
    }, [currentPage, onClick, onClickNext, onClickPrev, pages]);

    return (
      <div className={ui.wrapper}>
        <div ref={carouselRef} className={clsx(ui.container, "no-scrollbar")}>
          {items.map((item, index) => (
            <div ref={itemRef} key={index} className={ui.item}>
              {slot.default(item, index)}
            </div>
          ))}
        </div>

        {arrows && (
          <div className={ui.arrows?.wrapper}>
            {slot.prev ? (
              slot.prev(onClickPrev, isFirst)
            ) : (
              <button
                onClick={onClickPrev}
                disabled={isFirst}
                className={clsx(ui.arrows?.prevButton, isFirst && "cursor-not-allowed")}
              >
                <Icon
                  icon={prevButton && prevButton.icon ? prevButton.icon : "mdi-arrow-left-circle"}
                />
                {prevButton?.label}
              </button>
            )}

            {slot.next ? (
              slot.next(onClickNext, isFirst)
            ) : (
              <button
                onClick={onClickNext}
                disabled={isLast}
                className={clsx(ui.arrows?.nextButton, isLast && "cursor-not-allowed")}
              >
                <Icon
                  icon={nextButton && nextButton.icon ? nextButton.icon : "mdi-arrow-right-circle"}
                />
                {nextButton?.label}
              </button>
            )}
          </div>
        )}
        {indicators && (
          <div className={ui.indicators?.wrapper}>
            {Array.from({ length: pages }, (_, index) => index + 1).map((page) =>
              slot.indicator ? (
                slot.indicator(onClick, page, page === currentPage)
              ) : (
                <button
                  key={page}
                  aria-selected={page === currentPage}
                  aria-label={`set slide ${page}`}
                  className={clsx(
                    ui.indicators?.base,
                    page === currentPage ? ui.indicators?.active : ui.indicators?.inactive,
                  )}
                  onClick={() => onClick(page)}
                ></button>
              ),
            )}
          </div>
        )}
      </div>
    );
  },
);

export default Carousel;
