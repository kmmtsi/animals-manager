import { User } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { pageGapY, pageTitle } from "../../../utils/css";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { NewMsg } from "../../generalUI/NewMsg";
import { NameAndSex } from "../NameAndSex";
import { AnimalInfo } from "./AnimalInfo";
import { AnimalUpdate } from "./AnimalUpdate";

export const AnimalPage = () => {
  const user = useOutletContext<User>();
  const { animalId } = useParams();
  const { t } = useTranslation();

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(user.uid);
  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    user.uid
  );
  const { allAnimalsFolders, animalsFoldersErr, animalsFoldersMutator } =
    useFetchAnimalsFolders(user.uid);

  if (allAnimals && allBreedings && allAnimalsFolders && animalId) {
    const animal = allAnimals.find((animal) => animal.id === animalId);

    if (animal) {
      return (
        <div className={pageGapY}>
          <Breadcrumb page={"animalPage"} dynamic={animal.name} />
          <h1 className={pageTitle}>
            <NameAndSex animal={animal} />
          </h1>
          {isUpdate ? (
            <AnimalUpdate
              prevAnimal={animal}
              setIsUpdate={setIsUpdate}
              allAnimals={allAnimals}
              allBreedings={allBreedings}
              animalsMutator={animalsMutator}
              breedingsMutator={breedingsMutator}
            />
          ) : (
            <AnimalInfo
              animal={animal}
              setIsUpdate={setIsUpdate}
              allBreedings={allBreedings}
              allAnimals={allAnimals}
              allAnimalsFolders={allAnimalsFolders}
              breedingsMutator={breedingsMutator}
              animalsMutator={animalsMutator}
              animalsFoldersMutator={animalsFoldersMutator}
            />
          )}
        </div>
      );
    } else {
      return <NewMsg role="err">{t("animalNotFound")}</NewMsg>;
    }
  }
  if (breedingsErr || animalsErr || animalsFoldersErr) {
    return (
      <NewMsg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          animalsFoldersErr?.message}
      </NewMsg>
    );
  }
};
