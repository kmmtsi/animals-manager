import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { NewMsg } from "../../generalUI/NewMsg";
import { FolderPage } from "../base/FolderPage";

export const AnimalsFolderPage = () => {
  const authUser = useOutletContext<User>();

  const { allAnimalsFolders, animalsFoldersErr, animalsFoldersMutator } =
    useFetchAnimalsFolders(authUser.uid);

  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(
    authUser.uid
  );

  if (allAnimalsFolders && allAnimals) {
    return (
      <FolderPage
        type="animalsFolder"
        allFolders={allAnimalsFolders}
        allItems={allAnimals}
        foldersMutator={animalsFoldersMutator}
        itemsMutator={animalsMutator}
      />
    );
  }
  if (animalsFoldersErr || animalsErr) {
    return (
      <NewMsg role="err">
        {animalsFoldersErr?.message || animalsErr?.message}
      </NewMsg>
    );
  }
};
