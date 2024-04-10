import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { handleDeleteAnimals } from "../../../utils/animal/deleteAnimals";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { FolderPage } from "../base/FolderPage";

export const AnimalsFolderPage = () => {
  const authUser = useOutletContext<User>();

  const { allAnimalsFolders, animalsFoldersErr, animalsFoldersMutator } =
    useFetchAnimalsFolders(authUser.uid);

  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(
    authUser.uid
  );

  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    authUser.uid
  );

  if (allAnimalsFolders && allAnimals && allBreedings) {
    return (
      <FolderPage
        type="animalsFolder"
        allFolders={allAnimalsFolders}
        allItems={allAnimals}
        foldersMutator={animalsFoldersMutator}
        itemsMutator={animalsMutator}
        handleDeleteItems={async (checkedItems) => {
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
  if (animalsFoldersErr || animalsErr || breedingsErr) {
    return (
      <Msg role="err">
        {animalsFoldersErr?.message ||
          animalsErr?.message ||
          breedingsErr?.message}
      </Msg>
    );
  }
};
