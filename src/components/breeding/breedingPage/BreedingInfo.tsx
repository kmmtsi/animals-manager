import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { convertDateToLocalDateString } from "../../../utils/common/commonUtils";
import { Breeding, Folder } from "../../../utils/common/definitions";
import { getPathToBreedingsFolderPage } from "../../../utils/common/pageUtils";
import { fieldGapY, infoBox } from "../../../utils/css";
import { OnAnimalClick } from "../../animal/formattedValues/NameAndSex";
import { Folders } from "../../generalUI/animalAndBreeding/item/Folders";
import {
  DeleteItemBtnConfig,
  ItemInfoBase,
} from "../../generalUI/animalAndBreeding/item/ItemInfoBase";
import { BreedingGrid } from "../BreedingGrid";
import { Status } from "../formattedValues/Status";

export const BreedingInfo = ({
  breeding,
  setIsUpdate,
  allBreedingsFolders,
  deleteItemBtnConfig,
  disableBackBtn,
  onAnimalClick,
}: {
  breeding: Breeding;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allBreedingsFolders: Folder[];
  deleteItemBtnConfig: DeleteItemBtnConfig;
  disableBackBtn: boolean;
  onAnimalClick: OnAnimalClick;
}) => {
  const { t } = useTranslation();

  const { startDate, endDate } = breeding;

  return (
    <ItemInfoBase
      note={breeding.note}
      createdAt={breeding.createdAt}
      updatedAt={breeding.updatedAt}
      setIsUpdateToTrue={() => setIsUpdate(true)}
      deleteItemBtnConfig={deleteItemBtnConfig}
      disableBackBtn={disableBackBtn}
    >
      <Folders
        folderIds={breeding.folderIds}
        allFolders={allBreedingsFolders}
        getPathToFolderPage={(folderId) =>
          getPathToBreedingsFolderPage(folderId)
        }
      />
      <BreedingGrid miniBreeding={breeding} onAnimalClick={onAnimalClick} />
      {/* status */}
      <div className={fieldGapY}>
        <div>{t("status")}</div>
        <div className={infoBox}>
          <Status value={breeding.status} enableEmpty={true} />
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
    </ItemInfoBase>
  );
};
