import { useEffect, useRef, useState, forwardRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import Carousel, { ICarouselRef } from "@/components/carousel";
import Skeleton from "@/components/skeleton";
import Pagination from "@/components/pagination";
import { cn } from "@utils/cn";
import { useWindowSize } from "@react-hooks-library/core";
import { MainCardProps } from "./MainCard.types";

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  ({ id, title, overview, genre, images }, ref) => {
    const carouselRef = useRef<ICarouselRef>(null);
    const [carouselImgLoading, setCarouselImgLoading] = useState(true);
    const [carouselReady, setCarouselReady] = useState(false);

    useEffect(() => {
      if (carouselImgLoading) {
        setInterval(() => {
          if (!carouselRef.current) return;

          if (carouselRef.current.page === carouselRef.current.pages) {
            carouselRef.current.select(0);
            return;
          }

          carouselRef.current.next();
        }, 5000);
      }
    }, [carouselImgLoading]);

    const [currentValue, setCurrentValue] = useState(1);
    const prevCarouselPage = useRef(currentValue);

    useEffect(() => {
      // Set carousel ready after component mounts
      setTimeout(() => setCarouselReady(true), 0);
    }, []);

    const onCurrentValueChange = (value: number) => {
      const carousel = carouselRef.current;
      if (carousel) {
        switch (value - prevCarouselPage.current) {
          case 1:
            carousel.next();
            break;
          case -1:
            carousel.prev();
            break;
          default:
            carousel.select(value);
            break;
        }
      }
      prevCarouselPage.current = value;
    };

    const onCarouselPageChange = (page: number) => {
      setCurrentValue(page);
    };

    const screenWidth = useWindowSize().width;

    return (
      <div
        ref={ref}
        className="p-2 md:p-4 lg:pl-6 text-white bg-tertiary-500 rounded-lg flex flex-col sm:flex-row-reverse justify-between gap-4 md:gap-8"
      >
        <div className="w-full sm:w-[60%] aspect-video overflow-hidden">
          <Carousel
            ref={carouselRef}
            items={images}
            ui={{
              item: "basis-full",
              wrapper: "h-full",
              container: "rounded-lg w-full",
            }}
            onPageChange={onCarouselPageChange}
            slot={{
              default: (item, index) => (
                <>
                  {carouselImgLoading && <Skeleton className="w-full" />}
                  <img
                    src={item}
                    onLoad={() => index === 0 && setCarouselImgLoading(false)}
                    className={cn(
                      "w-full h-full object-cover",
                      carouselImgLoading ? "hidden" : "block",
                    )}
                    key={index}
                  />
                </>
              ),
            }}
          />
        </div>
        <div className="sm:hidden flex justify-center items-center">
          {screenWidth <= 480 && (
            <Pagination
              currentValue={currentValue}
              onCurrentValueChange={onCurrentValueChange}
              total={images.length}
              max={images.length}
              pageCount={1}
              ui={{
                wrapper: "gap-x-3",
                base: "w-4 h-4",
                rounded: "rounded-full first:rounded-full last:rounded-full",
                activeButton: "text-primary-500",
                inactiveButton:
                  "text-tertiary-500 bg-tertiary-500 dark:text-tertiary-500 dark:bg-tertiary-500 focus:text-tertiary-500 focus:bg-tertiary-500 dark:focus:text-tertiary-500 dark:focus:bg-tertiary-500",
              }}
            />
          )}
        </div>

        <div className="py-4 grow sm:w-[40%] flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <p className=" text-primary-500 text-xs md:text-sm  font-redHatMono">{genre}</p>
            <h1 className="uppercase text-2xl md:text-[32px] font-bold font-redHatMono">{title}</h1>
            <p className="font-roboto text-justify text-xs md:text-base text-grey-500 mb-6">
              {overview}
            </p>
          </div>
          <Link
            to={`/movies/${id}`}
            className="w-32 h-8 bg-primary-500 hover:bg-primary-600 transition-all rounded-2xl flex items-center justify-center gap-2 text-xs md:text-base"
          >
            <Icon icon="mdi-eye" width="16" />
            See details
          </Link>
          <div className="hidden sm:block ">
            {carouselReady && (
              <Pagination
                currentValue={currentValue}
                onCurrentValueChange={onCurrentValueChange}
                total={images.length}
                max={screenWidth > 500 ? images.length : 5}
                pageCount={1}
                showPrev
                showNext
                ui={{
                  wrapper: "mt-16 gap-x-2",
                  base: "w-4 h-4",
                  rounded: "rounded-full first:rounded-full last:rounded-full",
                  activeButton: "text-primary-500",
                  inactiveButton:
                    "text-tertiary-500 bg-tertiary-500 dark:text-tertiary-500 dark:bg-tertiary-500 focus:text-tertiary-500 focus:bg-tertiary-500 dark:focus:text-tertiary-500 dark:focus:bg-tertiary-500",
                  prevButton: "w-8 h-8",
                  nextButton: "w-8 h-8",
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default MainCard;
