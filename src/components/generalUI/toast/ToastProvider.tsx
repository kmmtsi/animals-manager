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
    }, 5000);
  };

  return (
    <>
      <ToastContext.Provider value={showToast}>
        {/* Children = Header, Body, Footer */}
        {children}
      </ToastContext.Provider>
      {/* Toast */}
      <div
        className={`fixed inset-x-0 bottom-5 transition-opacity duration-200 ${
          isShown ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mx-auto bg-slate-600 text-white px-3 py-2 rounded w-fit">
          {text}
        </div>
      </div>
    </>
  );
};
