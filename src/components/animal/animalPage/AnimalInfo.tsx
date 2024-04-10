import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { convertDateToLocalDateString } from "../../../utils/common/commonUtils";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import { getPathToAnimalsFolderPage } from "../../../utils/common/pageUtils";
import { fieldGapY, infoBox } from "../../../utils/css";
import { Folders } from "../../generalUI/animalAndBreeding/item/Folders";
import {
  DeleteItemBtnConfig,
  ItemInfoBase,
} from "../../generalUI/animalAndBreeding/item/ItemInfoBase";
import { HealthCondition } from "../formattedValues/HealthCondition";
import {
  AnimalBreedingField,
  HandleBreedingClick,
} from "./AnimalBreedingField";

export const AnimalInfo = ({
  animal,
  setIsUpdate,
  allBreedings,
  allAnimalsFolders,
  deleteItemBtnConfig,
  handleBreedingClick,
  disableBackBtn,
}: {
  animal: Animal;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allBreedings: Breeding[];
  allAnimalsFolders: Folder[];
  deleteItemBtnConfig: DeleteItemBtnConfig;
  disableBackBtn: boolean;
  handleBreedingClick: HandleBreedingClick;
}) => {
  const { t } = useTranslation();

  return (
    <ItemInfoBase
      note={animal.note}
      createdAt={animal.createdAt}
      updatedAt={animal.updatedAt}
      setIsUpdateToTrue={() => setIsUpdate(true)}
      deleteItemBtnConfig={deleteItemBtnConfig}
      disableBackBtn={disableBackBtn}
    >
      {/* folders */}
      <Folders
        folderIds={animal.folderIds}
        allFolders={allAnimalsFolders}
        getPathToFolderPage={(folderId) => getPathToAnimalsFolderPage(folderId)}
      />
      {/* healthCondition */}
      <div className={fieldGapY}>
        <div>{t("healthCondition")}</div>
        <div className={infoBox}>
          <HealthCondition value={animal.healthCondition} enableEmpty={true} />
        </div>
      </div>
      {/* dateOfBirth */}
      <div className={fieldGapY}>
        <div>{t("dateOfBirth")}</div>
        <div className={infoBox}>
          {animal.dateOfBirth
            ? convertDateToLocalDateString(animal.dateOfBirth)
            : ""}
        </div>
      </div>
      {/* breedingAsParent */}
      <AnimalBreedingField
        label="breedingsAsParent"
        breedingIds={animal.breedingIdsAsParent}
        allBreedings={allBreedings}
        handleBreedingClick={handleBreedingClick}
      />
      {/* breedingAsChild */}
      <AnimalBreedingField
        label="breedingAsChild"
        breedingIds={animal.breedingIdAsChild ? [animal.breedingIdAsChild] : []}
        allBreedings={allBreedings}
        handleBreedingClick={handleBreedingClick}
      />
    </ItemInfoBase>
  );
};
