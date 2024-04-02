import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { handleDeleteBreedings } from "../../../utils/breeding/deleteBreedings";
import { Breeding } from "../../../utils/common/definitions";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { NewMsg } from "../../generalUI/NewMsg";
import { Items } from "../../generalUI/animalAndBreeding/items/Items";
import { TableView } from "../../generalUI/animalAndBreeding/items/tableView/TableView";

export const Breedings = ({ breedings }: { breedings: Breeding[] }) => {
  const authUser = useOutletContext<User>();
  const { t } = useTranslation();

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
      <Items
        items={breedings}
        renderNoItem={() => <div>{t("noBreeding")}</div>}
        renderTableView={() => (
          <TableView
            type="breedings"
            items={breedings}
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
        )}
      />
    );
  }
  if (breedingsErr || animalsErr || breedingsFoldersErr) {
    return (
      <NewMsg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          breedingsFoldersErr?.message}
      </NewMsg>
    );
  }
};
