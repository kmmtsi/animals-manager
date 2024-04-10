import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { FolderCreate } from "../base/FolderCreate";

export const BreedingsFolderCreate = () => {
  const authUser = useOutletContext<User>();

  const { allBreedingsFolders, breedingsFoldersErr, breedingsFoldersMutator } =
    useFetchBreedingsFolders(authUser.uid);

  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    authUser.uid
  );

  if (allBreedingsFolders && allBreedings) {
    return (
      <FolderCreate
        type="breedingsFolder"
        allFolders={allBreedingsFolders}
        allItems={allBreedings}
        foldersMutator={breedingsFoldersMutator}
        itemsMutator={breedingsMutator}
      />
    );
  }
  if (breedingsFoldersErr || breedingsErr) {
    return (
      <Msg role="err">
        {breedingsFoldersErr?.message || breedingsErr?.message}
      </Msg>
    );
  }
};
