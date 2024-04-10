import { ReactNode } from "react";

type TooltipPosition = "topLeft" | "top" | "topRight";

export const Tooltip = ({
  position,
  boxStyle,
  isBubble,
  renderItem,
  children,
}: {
  position: TooltipPosition;
  boxStyle: string;
  isBubble?: boolean;
  renderItem: () => ReactNode;
  children: ReactNode;
}) => {
  const boxPosition: Record<TooltipPosition, string> = {
    topLeft: "bottom-full left-0 mb-3",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    topRight: "bottom-full right-0 mb-3",
  };

  const bubblePosition: Record<TooltipPosition, string> = {
    topLeft: "top-full -translate-y-[5px] left-1.5",
    top: "top-full left-1/2 -translate-x-1/2",
    topRight: "top-full -translate-y-[5px] right-1.5",
  };

  return (
    <div className="relative">
      {children}
      {/* Tooltip */}
      <div className={`absolute z-0 w-fit ${boxPosition[position]}`}>
        {/* ボックス */}
        <div className={`relative ${boxStyle}`}>
          {/* ボックス内の要素 */}
          {renderItem()}
          {/* 吹き出し部分 */}
          {isBubble && (
            <div
              className={`pointer-events-none absolute -z-10 border-ihnerit border-x-[8px] border-t-[16px] border-x-transparent border-gray-800 ${bubblePosition[position]}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
