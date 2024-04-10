import { ReactNode } from "react";
import { DemoWindow } from "./tryMeUtils/tryMeUtils";

export const TryMeWindow = ({
  window,
  currentWindow,
  children,
  stopTimer,
}: {
  window: DemoWindow;
  currentWindow: DemoWindow;
  children: ReactNode;
  stopTimer: () => void;
}) => {
  return (
    <div
      className={`overflow-y-auto transition-opacity duration-500 ${
        currentWindow === window
          ? "opacity-100"
          : "opacity-0 h-0 w-0 overflow-hidden"
      }`}
      onClick={() => stopTimer()}
    >
      {children}
    </div>
  );
};
