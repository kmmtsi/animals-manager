import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { handleDeleteBreedings } from "../../../utils/breeding/deleteBreedings";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { FolderPage } from "../base/FolderPage";

export const BreedingsFolderPage = () => {
  const authUser = useOutletContext<User>();

  const { allBreedingsFolders, breedingsFoldersErr, breedingsFoldersMutator } =
    useFetchBreedingsFolders(authUser.uid);

  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    authUser.uid
  );

  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(
    authUser.uid
  );

  if (allBreedingsFolders && allBreedings && allAnimals) {
    return (
      <FolderPage
        type="breedingsFolder"
        allFolders={allBreedingsFolders}
        allItems={allBreedings}
        foldersMutator={breedingsFoldersMutator}
        itemsMutator={breedingsMutator}
        handleDeleteItems={async (checkedItems) => {
          await handleDeleteBreedings(
            checkedItems,
            authUser.uid,
            allBreedings,
            allAnimals,
            allBreedingsFolders,
            breedingsMutator,
            animalsMutator,
            breedingsFoldersMutator
          );
        }}
      />
    );
  }
  if (breedingsFoldersErr || breedingsErr || animalsErr) {
    return (
      <Msg role="err">
        {breedingsFoldersErr?.message ||
          breedingsErr?.message ||
          animalsErr?.message}
      </Msg>
    );
  }
};
