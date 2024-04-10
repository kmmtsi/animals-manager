import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { AllFolders } from "../base/AllFolders";

export const AllBreedingsFolders = () => {
  const authUser = useOutletContext<User>();
  const { allBreedingsFolders, breedingsFoldersErr } = useFetchBreedingsFolders(
    authUser.uid
  );

  if (allBreedingsFolders) {
    return (
      <AllFolders type="breedingsFolder" allFolders={allBreedingsFolders} />
    );
  }
  if (breedingsFoldersErr) {
    return <Msg role="err">{breedingsFoldersErr.message}</Msg>;
  }
};
