import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { AllFolders } from "../base/AllFolders";

export const AllAnimalsFolders = () => {
  const authUser = useOutletContext<User>();
  const { allAnimalsFolders, animalsFoldersErr } = useFetchAnimalsFolders(
    authUser.uid
  );

  if (allAnimalsFolders) {
    return <AllFolders type="animalsFolder" allFolders={allAnimalsFolders} />;
  }
  if (animalsFoldersErr) {
    return <Msg role="err">{animalsFoldersErr.message}</Msg>;
  }
};
