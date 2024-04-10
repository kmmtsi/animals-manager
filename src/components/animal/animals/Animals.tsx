import { User } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { handleDeleteAnimals } from "../../../utils/animal/deleteAnimals";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { Animal } from "../../../utils/common/definitions";
import { getPathToAnimalPage } from "../../../utils/common/pageUtils";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { AnimalsBase } from "./AnimalsBase";

// デモページ以外でのAnimals
export const Animals = ({ animals }: { animals: Animal[] }) => {
  const authUser = useOutletContext<User>();
  const navigate = useNavigate();

  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(
    authUser.uid
  );
  const { allBreedings, breedingsMutator, breedingsErr } = useFetchBreedings(
    authUser.uid
  );
  const { allAnimalsFolders, animalsFoldersMutator, animalsFoldersErr } =
    useFetchAnimalsFolders(authUser.uid);

  if (allAnimals && allBreedings && allAnimalsFolders) {
    return (
      <AnimalsBase
        animals={animals}
        handleAnimalClick={(id) => navigate(getPathToAnimalPage(id))}
        handleDeleteAnimals={async (checkedItems) => {
          await handleDeleteAnimals(
            checkedItems,
            authUser.uid,
            allAnimals,
            allBreedings,
            allAnimalsFolders,
            animalsMutator,
            breedingsMutator,
            animalsFoldersMutator
          );
        }}
      />
    );
  }

  if (animalsErr || breedingsErr | animalsFoldersErr) {
    return (
      <Msg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          animalsFoldersErr?.message}
      </Msg>
    );
  }
};
