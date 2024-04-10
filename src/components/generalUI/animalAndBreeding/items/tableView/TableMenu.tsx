import { Animal, Breeding } from "../../../../../utils/common/definitions";
import { FsToSPreference } from "./FsToSPreference";
import { HandleDeleteItems, TableMenuLeft } from "./TableMenuLeft";
import { ColumnPreferences } from "./tableUtils";

export const TableMenu = <T extends Animal | Breeding>({
  type,
  rowCounts,
  checkedItems,
  fsToS,
  handleCheckFToS,
  handleDeleteItems,
  clearCheck,
}: {
  type: T extends Animal ? "animals" : "breedings";
  rowCounts: number;
  checkedItems: T[];
  fsToS: ColumnPreferences<T>;
  handleCheckFToS: (field: keyof ColumnPreferences<T>) => void;
  handleDeleteItems: HandleDeleteItems<T>;
  clearCheck: () => void;
}) => {
  return (
    <div className="flex justify-between items-center">
      {/* 左側エリア */}
      <TableMenuLeft
        type={type}
        rowCounts={rowCounts}
        checkedItems={checkedItems}
        handleDeleteItems={handleDeleteItems}
        clearCheck={clearCheck}
      />
      {/* 右側エリア */}
      <div className="flex gap-x-2">
        {/* 表示設定 */}
        <FsToSPreference fsToS={fsToS} handleCheckFToS={handleCheckFToS} />
      </div>
    </div>
  );
};
