import { User } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { handleDeleteBreedings } from "../../../utils/breeding/deleteBreedings";
import { Breeding } from "../../../utils/common/definitions";
import { getPathToBreedingPage } from "../../../utils/common/pageUtils";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { Msg } from "../../generalUI/Msg";
import { BreedingsBase } from "./BreedingsBase";

// デモページ以外でのBreedings
export const Breedings = ({ breedings }: { breedings: Breeding[] }) => {
  const authUser = useOutletContext<User>();
  const navigate = useNavigate();

  const { allBreedings, breedingsMutator, breedingsErr } = useFetchBreedings(
    authUser.uid
  );
  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(
    authUser.uid
  );
  const { allBreedingsFolders, breedingsFoldersMutator, breedingsFoldersErr } =
    useFetchBreedingsFolders(authUser.uid);

  if (allBreedings && allAnimals && allBreedingsFolders) {
    return (
      <BreedingsBase
        breedings={breedings}
        handleBreedingClick={(id) => navigate(getPathToBreedingPage(id))}
        handleDeleteBreedings={async (checkedItems) => {
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

  if (breedingsErr || animalsErr || breedingsFoldersErr) {
    return (
      <Msg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          breedingsFoldersErr?.message}
      </Msg>
    );
  }
};
