import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { FolderCreate } from "../base/FolderCreate";

export const AnimalsFolderCreate = () => {
  const authUser = useOutletContext<User>();

  const { allAnimalsFolders, animalsFoldersErr, animalsFoldersMutator } =
    useFetchAnimalsFolders(authUser.uid);

  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(
    authUser.uid
  );

  if (allAnimalsFolders && allAnimals) {
    return (
      <FolderCreate
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
      <Msg role="err">{animalsFoldersErr?.message || animalsErr?.message}</Msg>
    );
  }
};
