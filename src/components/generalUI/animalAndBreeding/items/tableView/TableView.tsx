import { Animal, Breeding } from "../../../../../utils/common/definitions";
import { HandleItemClick, Table } from "./Table";
import { TableMenu } from "./TableMenu";
import { HandleDeleteItems } from "./TableMenuLeft";
import { useCheckTable, useColumnPreferences } from "./tableUtils";

export const TableView = <T extends Animal | Breeding>({
  type,
  items,
  handleDeleteItems,
  hideCheckbox,
  handleItemClick,
}: {
  type: T extends Animal ? "animals" : "breedings";
  items: T[];
  handleDeleteItems: HandleDeleteItems<T>;
  hideCheckbox?: boolean;
  handleItemClick: HandleItemClick;
}) => {
  const { checkedItems, check, checkAll, clearCheck } = useCheckTable<T>();

  const { fsToS, handleCheckFToS } = useColumnPreferences<T>(type);

  return (
    <div className="space-y-3">
      <TableMenu
        type={type}
        rowCounts={items.length}
        checkedItems={checkedItems}
        fsToS={fsToS}
        handleCheckFToS={handleCheckFToS}
        handleDeleteItems={handleDeleteItems}
        clearCheck={clearCheck}
      />
      <div className="overflow-x-auto">
        <Table
          type={type}
          items={items}
          checkedItems={checkedItems}
          check={check}
          checkAll={checkAll}
          fsToS={fsToS}
          hideCheckbox={hideCheckbox}
          handleItemClick={handleItemClick}
        />
      </div>
    </div>
  );
};
