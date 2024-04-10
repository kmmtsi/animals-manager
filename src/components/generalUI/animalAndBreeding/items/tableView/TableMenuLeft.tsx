import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { convertErrToMsg } from "../../../../../utils/common/commonUtils";
import { Animal, Breeding } from "../../../../../utils/common/definitions";
import {
  getPathToAnimalsFolderCreate,
  getPathToBreedingsFolderCreate,
} from "../../../../../utils/common/pageUtils";
import { btnOutlineBlue } from "../../../../../utils/css";
import { ClickableIcon } from "../../../ClickableIcon";
import { useToast } from "../../../toast/useToast";

export type State = {
  selectedItemIds: string[];
} | null;

export type HandleDeleteItems<T extends Animal | Breeding> = (
  checkedItems: T[]
) => Promise<void>;

export const TableMenuLeft = <T extends Animal | Breeding>({
  type,
  rowCounts,
  checkedItems,
  handleDeleteItems,
  clearCheck,
}: {
  type: T extends Animal ? "animals" : "breedings";
  rowCounts: number;
  checkedItems: T[];
  handleDeleteItems: HandleDeleteItems<T>;
  clearCheck: () => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showToast = useToast();

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
            <ClickableIcon
              icon={faTrashCan}
              onClick={async () => {
                try {
                  await handleDeleteItems(checkedItems);
                  clearCheck();
                  showToast(
                    t(
                      type === "animals" ? "animalsDeleted" : "breedingsDeleted"
                    )
                  );
                } catch (err) {
                  showToast(convertErrToMsg(err));
                }
              }}
            />
            {/* フォルダを作成 */}
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
      )}
    </div>
  );
};
