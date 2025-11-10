import { Icon } from "@iconify/react/dist/iconify.js";
import { mergeUI } from "../utils/helpers";
import clsx from "clsx";
import { useEffect, useState } from "react";

export interface IButton {
  icon?: string;
  title?: string;
  key: string;
}

export interface ITabsUI {
  wrapper?: string;
  button?: {
    base?: string;
    icon?: string;
    title?: string;
    active?: string;
    inactive?: string;
  };
}

export interface ITabsProps {
  items: IButton[];
  currentTab?: string;
  onCurrentTabChange?: (value: string) => void;
  ui?: ITabsUI;
}

const Tabs = ({ items, currentTab, onCurrentTabChange, ui }: ITabsProps) => {
  const defaultUI: ITabsUI = {
    wrapper:
      "w-full h-full p-1 my-6 rounded-[20px] border-grey-500 border bg-tertiary-500 flex justify-between items-center",
    button: {
      base: "h-8 px-4 text-white rounded-2xl grow flex items-center justify-center gap-1 transition-all duration-300 ease-out",
      icon: "h-8",
      title: "text-xs font-roboto",
      active: "bg-primary-500 ",
      inactive: "bg-transparent",
    },
  };

  ui = mergeUI<ITabsUI>(defaultUI, ui);

  const [selectTab, setSelectTab] = useState<string>();
  useEffect(() => {
    setSelectTab(currentTab);
  }, [currentTab]);

  const onTabClick = (key: string) => {
    setSelectTab(key);
    if (onCurrentTabChange) {
      onCurrentTabChange(key);
    }
  };

  return (
    <div className={ui.wrapper}>
      {items.map((btn, index) => (
        <button
          className={clsx(
            ui.button!.base,
            selectTab
              ? selectTab === btn.key
                ? ui.button!.active
                : ui.button!.inactive
              : index === 0
                ? ui.button!.active
                : ui.button!.inactive
          )}
          key={index}
          onClick={() => onTabClick(btn.key)}>
          {btn.icon && <Icon icon={btn.icon} key={index} className={ui.button?.icon} />}
          <span key={index} className={ui.button?.title}>
            {btn.title}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
