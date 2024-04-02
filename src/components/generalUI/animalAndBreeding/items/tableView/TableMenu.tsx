import { MouseEventHandler } from "react";
import { Animal, Breeding } from "../../../../../utils/common/definitions";
import { FsToS } from "./tableUtils";
import { FsToSPreference } from "../../../FsToSPreference";
import { TableMenuLeft } from "./TableMenuLeft";

export const TableMenu = <T extends Animal | Breeding>({
  type,
  rowCounts,
  checkedItems,
  fsToS,
  handleCheckFToS,
  onDeleteClick,
}: {
  type: T extends Animal ? "animals" : "breedings";
  rowCounts: number;
  checkedItems: T[];
  fsToS: FsToS<T>;
  handleCheckFToS: (field: keyof FsToS<T>) => void;
  onDeleteClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="flex justify-between items-center">
      {/* 左側エリア */}
      <TableMenuLeft
        type={type}
        rowCounts={rowCounts}
        checkedItems={checkedItems}
        onDeleteClick={onDeleteClick}
      />
      {/* 右側エリア */}
      <div className="flex gap-x-2">
        {/* 表示設定 */}
        <FsToSPreference fsToS={fsToS} handleCheckFToS={handleCheckFToS} />
      </div>
    </div>
  );
};
