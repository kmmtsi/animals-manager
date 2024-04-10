import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { handleDeleteAnimals } from "../../../utils/animal/deleteAnimals";
import { handleUpdateAnimalForm } from "../../../utils/animal/updateAnimal";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { Animal, MiniAnimal } from "../../../utils/common/definitions";
import {
  getPathToAllAnimals,
  getPathToBreedingCreate,
  getPathToBreedingPage,
} from "../../../utils/common/pageUtils";
import { pageGapY } from "../../../utils/css";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { Msg } from "../../generalUI/Msg";
import { AnimalBase } from "./AnimalBase";

export type State = {
  type: "child" | "parent";
  miniAnimal: MiniAnimal;
};

export const AnimalPage = () => {
  const user = useOutletContext<User>();
  const { animalId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(user.uid);
  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    user.uid
  );
  const { allAnimalsFolders, animalsFoldersErr, animalsFoldersMutator } =
    useFetchAnimalsFolders(user.uid);

  const createState = (animal: Animal, type: "child" | "parent"): State => ({
    type,
    miniAnimal: {
      id: animal.id,
      name: animal.name,
      sex: animal.sex,
    },
  });

  if (allAnimals && allBreedings && allAnimalsFolders && animalId) {
    const animal = allAnimals.find((animal) => animal.id === animalId);

    if (animal) {
      return (
        <div className={pageGapY}>
          <Breadcrumb page={"animalPage"} dynamic={animal.name} />
          <AnimalBase
            animal={animal}
            allAnimals={allAnimals}
            allBreedings={allBreedings}
            allAnimalsFolders={allAnimalsFolders}
            disableBackBtn={false}
            handleUpdateAnimal={async (data, prevAnimal) => {
              await handleUpdateAnimalForm(
                data,
                user.uid,
                allAnimals,
                allBreedings,
                prevAnimal,
                {
                  mutators: { animalsMutator, breedingsMutator },
                }
              );
            }}
            deleteItemBtnConfig={{
              label: "deleteAnimal",
              handleDeleteItem: async () =>
                await handleDeleteAnimals(
                  [animal],
                  user.uid,
                  allAnimals,
                  allBreedings,
                  allAnimalsFolders,
                  animalsMutator,
                  breedingsMutator,
                  animalsFoldersMutator
                ),
              toastMsg: "animalDeleted",
              navigateTo: getPathToAllAnimals(),
            }}
            handleBreedingClick={{
              breeding: (breedingId) =>
                navigate(getPathToBreedingPage(breedingId)),
              create: (label) => {
                navigate(getPathToBreedingCreate(), {
                  state: createState(
                    animal,
                    label === "breedingAsChild" ? "child" : "parent"
                  ),
                });
              },
            }}
          />
        </div>
      );
    } else {
      return <Msg role="err">{t("animalNotFound")}</Msg>;
    }
  }

  if (breedingsErr || animalsErr || animalsFoldersErr) {
    return (
      <Msg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          animalsFoldersErr?.message}
      </Msg>
    );
  }
};
