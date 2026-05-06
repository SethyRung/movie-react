import React, { useEffect, useState } from "react";
import { mergeUI } from "../lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";

export interface IPaginationUI {
  wrapper?: string;
  base?: string;
  rounded?: string;
  icon?: string;
  activeButton?: string;
  inactiveButton?: string;
  firstButton?: string;
  lastButton?: string;
  prevButton?: string;
  nextButton?: string;
}

export interface IPaginationProps {
  currentValue: number;
  onCurrentValueChange?: (value: number) => void;
  ui?: IPaginationUI;
  total: number;
  max?: number;
  divider?: string;
  pageCount?: number;
  disabled?: boolean;
  showIndicators?: boolean;
  showFirst?: boolean;
  showLast?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
  prevButton?: {
    label?: string;
    icon?: string;
  };
  nextButton?: {
    label?: string;
    icon?: string;
  };
  firstButton?: {
    label?: string;
    icon?: string;
  };
  lastButton?: {
    label?: string;
    icon?: string;
  };
  slot?: {
    prev?: (onClick: () => void) => React.JSX.Element;
    next?: (onClick: () => void) => React.JSX.Element;
    first?: (onClick: () => void) => React.JSX.Element;
    last?: (onClick: () => void) => React.JSX.Element;
  };
}

const Pagination = ({
  currentValue,
  onCurrentValueChange,
  ui,
  total,
  max = 7,
  divider = "\u2026",
  pageCount = 10,
  disabled = false,
  showIndicators = true,
  showFirst = false,
  showLast = false,
  showPrev = false,
  showNext = false,
  prevButton,
  nextButton,
  firstButton,
  lastButton,
  slot,
}: IPaginationProps) => {
  const defaultUI: IPaginationUI = {
    wrapper: "flex items-center -space-x-px",
    base: "focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium text-left break-all line-clamp-1 inline-flex justify-center items-center text-sm gap-x-1.5 px-2.5 py-1.5 p-1.5",
    rounded: "first:rounded-s-md last:rounded-e-md",
    icon: "flex-shrink-0 h-5 w-5",
    activeButton: "bg-primary-500",
    inactiveButton:
      "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
    firstButton:
      "rtl:[&_span:first-child]:rotate-180 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
    lastButton:
      "rtl:[&_span:last-child]:rotate-180 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
    prevButton:
      "rtl:[&_span:first-child]:rotate-180 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
    nextButton:
      "rtl:[&_span:last-child]:rotate-180 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
  };

  ui = mergeUI<IPaginationUI>(defaultUI, ui);

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(currentValue);
  }, [currentValue]);

  if (!onCurrentValueChange) {
    onCurrentValueChange = (page: number) => {
      setCurrentPage(page);
    };
  }

  const [pages, setPages] = useState<number[]>([]);
  useEffect(() => {
    setPages(Array.from({ length: Math.ceil(total / pageCount) }, (_, i) => i + 1));
  }, [pageCount, total]);

  const [displayPages, setDisplayPages] = useState<Array<number | string>>();
  useEffect(() => {
    const findDisplayPages = () => {
      const totalPages = pages.length;
      const current = currentPage;
      const maxDisplayedPages = Math.max(max, 5);

      const r = Math.floor((Math.min(maxDisplayedPages, totalPages) - 5) / 2);
      const r1 = current - r;
      const r2 = current + r;

      const beforeWrapped = r1 - 1 > 1;
      const afterWrapped = r2 + 1 < totalPages;

      const items: Array<number | string> = [];

      if (totalPages <= maxDisplayedPages) {
        for (let i = 1; i <= totalPages; i++) {
          items.push(i);
        }
        return items;
      }

      items.push(1);

      if (beforeWrapped) items.push(divider);

      if (!afterWrapped) {
        const addedItems = current + r + 2 - totalPages;
        for (let i = current - r - addedItems; i <= current - r - 1; i++) {
          items.push(i);
        }
      }

      for (let i = Math.max(2, r1); i <= Math.min(totalPages, r2); i++) {
        items.push(i);
      }

      if (!beforeWrapped) {
        const addedItems = 1 - (current - r - 2);
        for (let i = current + r + 1; i <= current + r + addedItems; i++) {
          items.push(i);
        }
      }

      if (afterWrapped) items.push(divider);

      if (r2 < totalPages) {
        items.push(totalPages);
      }

      // Replace divider by number on start edge case [1, '…', 3, ...]
      if (items.length >= 3 && items[1] === divider && items[2] === 3) {
        items[1] = 2;
      }

      // Replace divider by number on end edge case [..., 48, '…', 50]
      if (
        items.length >= 3 &&
        items[items.length - 2] === divider &&
        items[items.length - 1] === items.length
      ) {
        items[items.length - 2] = items.length - 1;
      }

      return items;
    };
    setDisplayPages(findDisplayPages());
  }, [currentPage, divider, max, pages]);

  const [canGoFirstOrPrev, setCanGoFirstOrPrev] = useState(true);
  useEffect(() => {
    setCanGoFirstOrPrev(currentPage > 1);
  }, [currentPage]);

  const [canGoLastOrNext, setCanGoLastOrNext] = useState(true);
  useEffect(() => {
    setCanGoLastOrNext(currentPage < pages.length);
  }, [currentPage, pages.length]);

  const onClickFirst = () => {
    if (!canGoFirstOrPrev) {
      return;
    }

    onCurrentValueChange(1);
  };

  const onClickLast = () => {
    if (!canGoLastOrNext) {
      return;
    }

    onCurrentValueChange(pages.length);
  };

  const onClickPage = (page: number | string) => {
    if (typeof page === "string" || page === currentPage) {
      return;
    }

    onCurrentValueChange(page);
  };

  const onClickPrev = () => {
    if (!canGoFirstOrPrev) {
      return;
    }

    onCurrentValueChange(currentPage - 1);
  };

  const onClickNext = () => {
    if (!canGoLastOrNext) {
      return;
    }

    onCurrentValueChange(currentPage + 1);
  };

  return (
    <div className={ui.wrapper}>
      {slot && slot.first
        ? slot.first(onClickFirst)
        : showFirst && (
            <button
              disabled={!canGoFirstOrPrev || disabled}
              aria-label="First"
              className={twMerge(ui.base, ui.rounded, ui.firstButton)}
              onClick={onClickFirst}
            >
              <Icon
                icon={
                  firstButton && firstButton.icon ? firstButton.icon : "mdi-chevron-double-left"
                }
                className={ui.icon}
              />
              {firstButton?.label}
            </button>
          )}

      {slot && slot.prev
        ? slot.prev(onClickPrev)
        : showPrev && (
            <button
              disabled={!canGoFirstOrPrev || disabled}
              aria-label="Prev"
              className={twMerge(ui.base, ui.rounded, ui.prevButton)}
              onClick={onClickPrev}
            >
              <Icon
                icon={prevButton && prevButton.icon ? prevButton.icon : "mdi-chevron-left"}
                className={ui.icon}
              />
              {prevButton?.label}
            </button>
          )}

      {showIndicators &&
        displayPages?.map((page, index) => (
          <button
            key={`${page}-${index}`}
            disabled={disabled}
            aria-label="Click"
            className={twMerge(
              ui.base,
              ui.rounded,
              page === currentPage ? ui.activeButton : ui.inactiveButton,
            )}
            onClick={() => onClickPage(page)}
          >
            {page}
          </button>
        ))}

      {slot && slot.next
        ? slot.next(onClickNext)
        : showNext && (
            <button
              disabled={!canGoLastOrNext || disabled}
              aria-label="Next"
              className={twMerge(ui.base, ui.rounded, ui.nextButton)}
              onClick={onClickNext}
            >
              <Icon
                icon={nextButton && nextButton.icon ? nextButton.icon : "mdi-chevron-right"}
                className={ui.icon}
              />
              {nextButton?.label}
            </button>
          )}

      {slot && slot.last
        ? slot.last(onClickLast)
        : showLast && (
            <button
              disabled={!canGoLastOrNext || disabled}
              aria-label="Last"
              className={twMerge(ui.base, ui.rounded, ui.lastButton)}
              onClick={onClickLast}
            >
              <Icon
                icon={lastButton && lastButton.icon ? lastButton.icon : "mdi-chevron-double-right"}
                className={ui.icon}
              />
              {lastButton?.label}
            </button>
          )}
    </div>
  );
};

export default Pagination;
