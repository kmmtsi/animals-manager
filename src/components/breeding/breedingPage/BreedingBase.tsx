import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import { pageGapY, pageTitle } from "../../../utils/css";
import { NameAndSex } from "../../animal/formattedValues/NameAndSex";
import { DeleteItemBtnConfig } from "../../generalUI/animalAndBreeding/item/ItemInfoBase";
import { OnAnimalClick } from "../../animal/formattedValues/NameAndSex";
import { BreedingInfo } from "./BreedingInfo";
import { BreedingUpdate, HandleUpdateBreeding } from "./BreedingUpdate";

export const BreedingBase = ({
  breeding,
  allAnimals,
  deleteItemBtnConfig,
  handleUpdateBreeding,
  allBreedingsFolders,
  disableBackBtn,
  onAnimalClick,
}: {
  breeding: Breeding;
  allAnimals: Animal[];
  deleteItemBtnConfig?: DeleteItemBtnConfig;
  handleUpdateBreeding: HandleUpdateBreeding;
  allBreedingsFolders: Folder[];
  disableBackBtn: boolean;
  onAnimalClick: OnAnimalClick;
}) => {
  const { t } = useTranslation();

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  return (
    <div className={pageGapY}>
      <h1 className={`${pageTitle}`}>
        {breeding.parents.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {breeding.parents.map((parent, i) => (
              <Fragment key={i}>
                {i === 1 && <div className="text-slate-200">×</div>}
                <NameAndSex key={i} animal={parent} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="text-slate-300">{t("noParents")}</div>
        )}
      </h1>
      {isUpdate ? (
        <BreedingUpdate
          prevBreeding={breeding}
          setIsUpdate={setIsUpdate}
          allAnimals={allAnimals}
          handleUpdateBreeding={handleUpdateBreeding}
        />
      ) : (
        <BreedingInfo
          breeding={breeding}
          setIsUpdate={setIsUpdate}
          allBreedingsFolders={allBreedingsFolders}
          deleteItemBtnConfig={deleteItemBtnConfig}
          disableBackBtn={disableBackBtn}
          onAnimalClick={onAnimalClick}
        />
      )}
    </div>
  );
};
