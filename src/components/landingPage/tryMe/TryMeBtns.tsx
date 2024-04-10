import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { DemoWindow, demoWindows } from "./tryMeUtils/tryMeUtils";

export const TryMeBtns = ({
  currentWindow,
  setCurrentWindow,
  stopTimer,
}: {
  currentWindow: DemoWindow;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
  stopTimer: () => void;
}) => {
  const { t } = useTranslation();
  const getBoxPosition = (i: number) => {
    if (i < 1) {
      return "left-0 sm:left-1/2 sm:-translate-x-1/2";
    } else if (i < demoWindows.length - 2) {
      return "left-1/2 -translate-x-1/2";
    } else {
      return "right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2";
    }
  };

  const getArrowPosition = (i: number) => {
    if (i < 1) {
      return "left-1.5 sm:left-1/2 sm:-translate-x-1/2";
    } else if (i < demoWindows.length - 2) {
      return "left-1/2 -translate-x-1/2";
    } else {
      return "right-1.5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2";
    }
  };

  return (
    <div className="flex justify-center pt-10 pb-4">
      {demoWindows.map((window, i) => {
        return (
          <div key={i} className="flex items-center">
            {/* 横のライン */}
            {i !== 0 && <div className="w-6 sm:w-8 h-px bg-blue-100" />}
            {/* relative用ラッパー */}
            <div className="relative group">
              {/* ドット */}
              <button
                type="button"
                className={`${
                  currentWindow === window
                    ? "size-4 bg-blue-500"
                    : "size-3 bg-blue-200"
                } rounded-full flex`}
                onClick={() => {
                  setCurrentWindow(window);
                  stopTimer();
                }}
              />
              {/* ボックスと矢印 */}
              <div className={`absolute bottom-full mb-3 ${getBoxPosition(i)}`}>
                {/* ボックス */}
                <div
                  className={`rounded bg-gray-800 text-white p-2 text-nowrap group-hover:block ${
                    currentWindow === window ? "block" : "hidden"
                  }`}
                >
                  {t(window)}
                </div>
                {/* 矢印 */}
                <div
                  className={`absolute border-x-[4px] border-t-[8px] border-x-transparent border-gray-800 top-full  ${getArrowPosition(
                    i
                  )} ${currentWindow === window ? "block" : "hidden"}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
