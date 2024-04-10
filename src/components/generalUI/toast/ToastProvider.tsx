import { ReactNode, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState<string>("");
  const [isShown, setIsShown] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (text: string) => {
    setText(text);
    setIsShown(true);
    if (timerRef.current) {
      // タイマーが存在する場合はリセット
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsShown(false);
    }, 6000);
  };

  return (
    <>
      <ToastContext.Provider value={showToast}>
        {children}
      </ToastContext.Provider>
      {/* Toast */}
      <div
        className={`fixed inset-x-0 top-full transition-transform duration-200 ${
          isShown ? "-translate-y-[calc(100%+50px)]" : "translate-y-0"
        }`}
      >
        <div className="mx-auto bg-slate-900 shadow-xl text-white px-3 py-2 rounded w-fit">
          {text}
        </div>
      </div>
    </>
  );
};
