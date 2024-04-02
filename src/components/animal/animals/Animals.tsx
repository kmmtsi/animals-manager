import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { handleDeleteAnimals } from "../../../utils/animal/deleteAnimals";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { Animal } from "../../../utils/common/definitions";
import { useFetchAnimalsFolders } from "../../../utils/folder/folderUtils";
import { NewMsg } from "../../generalUI/NewMsg";
import { Items } from "../../generalUI/animalAndBreeding/items/Items";
import { TableView } from "../../generalUI/animalAndBreeding/items/tableView/TableView";

export const Animals = ({ animals }: { animals: Animal[] }) => {
  const { t } = useTranslation();
  const authUser = useOutletContext<User>();

  const { allBreedings, breedingsMutator, breedingsErr } = useFetchBreedings(
    authUser.uid
  );
  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(
    authUser.uid
  );
  const { allAnimalsFolders, animalsFoldersMutator, animalsFoldersErr } =
    useFetchAnimalsFolders(authUser.uid);

  if (allBreedings && allAnimals && allAnimalsFolders) {
    return (
      <Items
        items={animals}
        renderNoItem={() => <div>{t("noAnimal")}</div>}
        renderTableView={() => (
          <TableView
            type="animals"
            items={animals}
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
        )}
      />
    );
  }
  if (animalsErr || breedingsErr | animalsFoldersErr) {
    return (
      <NewMsg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          animalsFoldersErr?.message}
      </NewMsg>
    );
  }
};
