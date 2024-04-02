import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import {
  convertErrToMsg,
  convertTsToLocalDateString,
} from "../../../utils/common/commonUtils";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import {
  getPathToAllAnimalsFolders,
  getPathToAllBreedingsFolders,
} from "../../../utils/common/pageUtils";
import {
  btn,
  btnOutlineBlue,
  btnOutlineRed,
  fieldGapY,
  formGapY,
  infoBox,
} from "../../../utils/css";
import { handleDeleteFolders } from "../../../utils/folder/deleteFolders";
import { Animals } from "../../animal/animals/Animals";
import { Breedings } from "../../breeding/breedings/Breedings";
import { useToast } from "../../generalUI/toast/useToast";

export const FolderInfo = <T extends Animal | Breeding>({
  type,
  folder,
  allFolders,
  allItems,
  foldersMutator,
  itemsMutator,
  setIsUpdate,
}: {
  type: T extends Animal ? "animalsFolder" : "breedingsFolder";
  folder: Folder;
  allFolders: Folder[];
  allItems: T[];
  foldersMutator: KeyedMutator<Folder[]>;
  itemsMutator: KeyedMutator<T[]>;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const authUser = useOutletContext<User>();
  const navigate = useNavigate();
  const showToast = useToast();

  const { itemIds, note, createdAt, createdBy, updatedAt, updatedBy } = folder;

  const items = itemIds.map(
    (id) => allItems.find((item) => item.id === id) as T
  );

  return (
    <div className={formGapY}>
      {/* テーブル */}
      <div>
        {type === "animalsFolder" ? (
          <Animals animals={items as Animal[]} />
        ) : (
          <Breedings breedings={items as Breeding[]} />
        )}
      </div>
      {/* note */}
      <div className={fieldGapY}>
        <div>{t("note")}</div>
        <div className={infoBox}>{note}</div>
      </div>
      {/* 作成日 */}
      <div className={fieldGapY}>
        <div>{t("createdAt")}</div>
        <div>{convertTsToLocalDateString(createdAt)}</div>
      </div>
      {/* 作成者 */}
      <div className={fieldGapY}>
        <div>{t("createdBy")}</div>
        <div>{createdBy}</div>
      </div>
      {/* 更新日 */}
      <div className={fieldGapY}>
        <div>{t("updatedAt")}</div>
        <div>{convertTsToLocalDateString(updatedAt)}</div>
      </div>
      {/* 更新者 */}
      <div className={fieldGapY}>
        <div>{t("updatedBy")}</div>
        <div>{updatedBy}</div>
      </div>
      <div className="flex gap-x-2">
        {/* 更新ボタン */}
        <button
          type="button"
          className={`${btn} ${btnOutlineBlue}`}
          onClick={() => setIsUpdate(true)}
        >
          {t("update")}
        </button>
        {/* 削除ボタン */}
        <button
          type="button"
          className={`${btn} ${btnOutlineRed}`}
          onClick={async () => {
            try {
              // 削除処理
              await handleDeleteFolders<T>(
                `${type}s` as T extends Animal
                  ? "animalsFolders"
                  : "breedingsFolders",
                [folder],
                authUser.uid,
                allFolders,
                allItems,
                foldersMutator,
                itemsMutator
              );
              showToast(t("folderDeleted"));
              navigate(
                type === "animalsFolder"
                  ? getPathToAllAnimalsFolders()
                  : getPathToAllBreedingsFolders()
              );
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        >
          {t("deleteFolder")}
        </button>
      </div>
    </div>
  );
};
