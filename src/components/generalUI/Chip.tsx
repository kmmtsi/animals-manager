import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { MouseEventHandler, ReactNode } from "react";
import { focus } from "../../utils/css";

export const Chip = ({
  children,
  className = "",
  onDelete,
}: {
  children: ReactNode;
  className?: string;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
}) => {
  // ✅ break-allがないと長い文字列がはみ出る（break-wordsでは✕）
  return (
    <div
      className={`flex gap-x-1 justify-center items-center bg-slate-200 px-2 py-1 rounded break-all ${className}`}
    >
      <div className="cursor-default">{children}</div>
      {onDelete && (
        // onDeleteが与えられた場合閉じるボタンを追加
        <button
          type="button"
          className={`flex items-center justify-center hover:bg-slate-300 rounded-full w-6 aspect-square ${focus}`}
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
};
