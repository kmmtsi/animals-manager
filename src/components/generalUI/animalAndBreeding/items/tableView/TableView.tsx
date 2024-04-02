import { useTranslation } from "react-i18next";
import { convertErrToMsg } from "../../../../../utils/common/commonUtils";
import { Animal, Breeding } from "../../../../../utils/common/definitions";
import { useToast } from "../../../toast/useToast";
import { Table } from "./Table";
import { TableMenu } from "./TableMenu";
import { RenderDataBundle, useCheckTable, useFsToS } from "./tableUtils";

export const TableView = <T extends Animal | Breeding>({
  type,
  items,
  handleDeleteItems,
}: {
  type: T extends Animal ? "animals" : "breedings";
  items: T[];
  handleDeleteItems: (checkedItems: T[]) => Promise<void>;
}) => {
  const showToast = useToast();
  const { t } = useTranslation();

  const { checkedItems, check, checkAll, clearCheck } = useCheckTable<T>();

  const { fsToS, handleCheckFToS } = useFsToS<T>(type);

  return (
    <div className="space-y-3">
      <TableMenu
        type={type}
        rowCounts={items.length}
        checkedItems={checkedItems}
        fsToS={fsToS}
        handleCheckFToS={handleCheckFToS}
        onDeleteClick={async () => {
          try {
            await handleDeleteItems(checkedItems);
            clearCheck();
            showToast(
              t(type === "animals" ? "animalsDeleted" : "breedingsDeleted")
            );
          } catch (err) {
            showToast(convertErrToMsg(err));
          }
        }}
      />
      <div className="overflow-x-auto">
        <Table
          type={type}
          items={items}
          checkedItems={checkedItems}
          check={check}
          checkAll={checkAll}
          fsToS={fsToS}
        />
      </div>
    </div>
  );
};
