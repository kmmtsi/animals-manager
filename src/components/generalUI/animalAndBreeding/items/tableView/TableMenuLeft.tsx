import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Animal, Breeding } from "../../../../../utils/common/definitions";
import {
  getPathToAnimalsFolderCreate,
  getPathToBreedingsFolderCreate,
} from "../../../../../utils/common/pageUtils";
import { btnOutlineBlue } from "../../../../../utils/css";
import { ClickableIcon } from "../../../ClickableIcon";

export type State = {
  selectedItemIds: string[];
} | null;

export const TableMenuLeft = <T extends Animal | Breeding>({
  type,
  rowCounts,
  checkedItems,
  onDeleteClick,
}: {
  type: T extends Animal ? "animals" : "breedings";
  rowCounts: number;
  checkedItems: T[];
  onDeleteClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-x-2 items-center">
      {/* 全x件 */}
      <div>{t("tableCount", { count: rowCounts })}</div>
      {/* 選択済み */}
      {checkedItems.length > 0 && (
        <div className="flex items-center gap-x-1">
          {/* x件選択済み */}
          <div>{t("tableCheckCount", { x: checkedItems.length })}</div>
          <div className="flex items-center gap-x-2">
            {/* ゴミ箱アイコン */}
            <div>
              <ClickableIcon icon={faTrashCan} onClick={onDeleteClick} />
            </div>
            {/* フォルダを作成 */}
            <div>
              <button
                type="button"
                className={`px-2 py-1 border rounded ${btnOutlineBlue}`}
                onClick={() =>
                  navigate(
                    type === "animals"
                      ? getPathToAnimalsFolderCreate()
                      : getPathToBreedingsFolderCreate(),
                    {
                      state: {
                        selectedItemIds: checkedItems.map((item) => item.id),
                      } as State,
                    }
                  )
                }
              >
                {t("createFolder")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
