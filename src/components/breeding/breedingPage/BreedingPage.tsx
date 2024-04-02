import { User } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import {
  findBreedingById,
  useFetchBreedings,
} from "../../../utils/breeding/breedingUtils";
import { pageGapY, pageTitle } from "../../../utils/css";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { NewMsg } from "../../generalUI/NewMsg";
import { Parents } from "../Parents";
import { BreedingInfo } from "./BreedingInfo";
import { BreedingUpdate } from "./BreedingUpdate";

export const BreedingPage = () => {
  const user = useOutletContext<User>();
  const { breedingId } = useParams();
  const { t } = useTranslation();

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    user.uid
  );
  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(user.uid);
  const { allBreedingsFolders, breedingsFoldersErr, breedingsFoldersMutator } =
    useFetchBreedingsFolders(user.uid);

  if (allBreedings && allAnimals && allBreedingsFolders && breedingId) {
    const breeding = findBreedingById(breedingId, allBreedings);

    if (breeding) {
      return (
        <div className={pageGapY}>
          <Breadcrumb page={"breedingPage"} dynamic={breeding.id} />
          <h1 className={pageTitle}>
            <Parents parents={breeding.parents} />
          </h1>
          {isUpdate ? (
            <BreedingUpdate
              prevBreeding={breeding}
              setIsUpdate={setIsUpdate}
              allBreedings={allBreedings}
              allAnimals={allAnimals}
              breedingsMutator={breedingsMutator}
              animalsMutator={animalsMutator}
            />
          ) : (
            <BreedingInfo
              breeding={breeding}
              setIsUpdate={setIsUpdate}
              allBreedings={allBreedings}
              allAnimals={allAnimals}
              allBreedingsFolders={allBreedingsFolders}
              breedingsMutator={breedingsMutator}
              animalsMutator={animalsMutator}
              breedingsFoldersMutator={breedingsFoldersMutator}
            />
          )}
        </div>
      );
    } else {
      return <NewMsg role="err">{t("breedingNotFound")}</NewMsg>;
    }
  }
  if (breedingsErr || animalsErr || breedingsFoldersErr) {
    return (
      <NewMsg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          breedingsFoldersErr?.message}
      </NewMsg>
    );
  }
};
