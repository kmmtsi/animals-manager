import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import { handleDeleteBreedings } from "../../../utils/breeding/deleteBreedings";
import {
  convertDateToLocalDateString,
  convertErrToMsg,
  convertTsToLocalDateString,
} from "../../../utils/common/commonUtils";
import {
  Animal,
  Breeding,
  Folder,
  statusOptions,
} from "../../../utils/common/definitions";
import { getPathToBreedings } from "../../../utils/common/pageUtils";
import {
  btn,
  btnOutlineBlue,
  btnOutlineRed,
  fieldGapY,
  formGapY,
  infoBox,
} from "../../../utils/css";
import { useToast } from "../../generalUI/toast/useToast";
import { Children } from "../Children";
import { Parents } from "../Parents";

export const BreedingInfo = ({
  breeding,
  setIsUpdate,
  allBreedings,
  allAnimals,
  allBreedingsFolders,
  breedingsMutator,
  animalsMutator,
  breedingsFoldersMutator,
}: {
  breeding: Breeding;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allBreedings: Breeding[];
  allAnimals: Animal[];
  allBreedingsFolders: Folder[];
  breedingsMutator: KeyedMutator<Breeding[]>;
  animalsMutator: KeyedMutator<Animal[]>;
  breedingsFoldersMutator: KeyedMutator<Folder[]>;
}) => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();

  const {
    parents,
    children,
    startDate,
    endDate,
    note,
    folderIds,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  } = breeding;

  return (
    <div className={formGapY}>
      <div>
        {folderIds.map((folderId, i) => {
          return <div key={i}>{folderId}</div>;
        })}
      </div>
      {/* 親 */}
      <div className={fieldGapY}>
        <div>{t("parents")}</div>
        <div className={infoBox}>
          <Parents parents={parents} isAnimalLink={true} />
        </div>
      </div>
      {/* 子 */}
      <div className={fieldGapY}>
        <div>{t("children")}</div>
        <div className={infoBox}>
          <Children children={children} isAnimalLink={true} />
        </div>
      </div>
      {/* status */}
      <div className={fieldGapY}>
        <div>{t("status")}</div>
        <div className={infoBox}>
          {statusOptions.find((opt) => opt.value === breeding.status)?.label}
        </div>
      </div>
      {/* 開始日 */}
      <div className={fieldGapY}>
        <div>{t("startDate")}</div>
        <div className={infoBox}>
          {startDate ? convertDateToLocalDateString(startDate) : ""}
        </div>
      </div>
      {/* 終了日 */}
      <div className={fieldGapY}>
        <div>{t("endDate")}</div>
        <div className={infoBox}>
          {endDate ? convertDateToLocalDateString(endDate) : ""}
        </div>
      </div>
      {/* メモ */}
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
      <div className="flex gap-x-4">
        {/* 編集ボタン */}
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
              await handleDeleteBreedings(
                [breeding],
                user.uid,
                allBreedings,
                allAnimals,
                allBreedingsFolders,
                breedingsMutator,
                animalsMutator,
                breedingsFoldersMutator
              );
              showToast(t("breedingDeleted"));
              navigate(getPathToBreedings());
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        >
          {t("deleteBreeding")}
        </button>
      </div>
    </div>
  );
};
