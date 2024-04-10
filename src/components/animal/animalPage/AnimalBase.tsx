import { useState } from "react";
import { useTranslation } from "react-i18next";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  Animal,
  AnimalFormData,
  Breeding,
  Folder,
} from "../../../utils/common/definitions";
import { pageGapY, pageTitle } from "../../../utils/css";
import { DeleteItemBtnConfig } from "../../generalUI/animalAndBreeding/item/ItemInfoBase";
import { useToast } from "../../generalUI/toast/useToast";
import { NameAndSex } from "../formattedValues/NameAndSex";
import { HandleBreedingClick } from "./AnimalBreedingField";
import { AnimalInfo } from "./AnimalInfo";
import { AnimalUpdate } from "./AnimalUpdate";

export const AnimalBase = ({
  animal,
  allAnimals,
  allBreedings,
  allAnimalsFolders,
  handleUpdateAnimal,
  deleteItemBtnConfig,
  handleBreedingClick,
  disableBackBtn,
}: {
  animal: Animal;
  allAnimals: Animal[];
  allBreedings: Breeding[];
  allAnimalsFolders: Folder[];
  handleUpdateAnimal: (
    data: AnimalFormData,
    prevAnimal: Animal
  ) => Promise<void>;
  deleteItemBtnConfig: DeleteItemBtnConfig;
  handleBreedingClick: HandleBreedingClick;
  disableBackBtn: boolean;
}) => {
  const showToast = useToast();
  const { t } = useTranslation();

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  return (
    <div className={pageGapY}>
      <h1 className={pageTitle}>
        <NameAndSex animal={animal} />
      </h1>
      {isUpdate ? (
        <AnimalUpdate
          animal={animal}
          setIsUpdate={setIsUpdate}
          allAnimals={allAnimals}
          formOperation={async (data) => {
            try {
              await handleUpdateAnimal(data as AnimalFormData, animal);
              showToast(t("animalUpdated"));
              setIsUpdate(false);
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        />
      ) : (
        <AnimalInfo
          animal={animal}
          setIsUpdate={setIsUpdate}
          allBreedings={allBreedings}
          allAnimalsFolders={allAnimalsFolders}
          deleteItemBtnConfig={deleteItemBtnConfig}
          handleBreedingClick={handleBreedingClick}
          disableBackBtn={disableBackBtn}
        />
      )}
    </div>
  );
};
