import { useTranslation } from "react-i18next";
import { Animal } from "../../../utils/common/definitions";
import { Items } from "../../generalUI/animalAndBreeding/items/Items";
import { TableView } from "../../generalUI/animalAndBreeding/items/tableView/TableView";
import { HandleDeleteItems } from "../../generalUI/animalAndBreeding/items/tableView/TableMenuLeft";

// demopageでも使用中
export const AnimalsBase = ({
  animals,
  handleDeleteAnimals,
  hideCheckbox,
  handleAnimalClick,
}: {
  animals: Animal[];
  handleDeleteAnimals: HandleDeleteItems<Animal>;
  hideCheckbox?: boolean;
  handleAnimalClick: (id: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Items
      items={animals}
      renderNoItem={() => <div>{t("noAnimal")}</div>}
      renderTableView={() => (
        <TableView
          type="animals"
          items={animals}
          handleDeleteItems={handleDeleteAnimals}
          hideCheckbox={hideCheckbox}
          handleItemClick={handleAnimalClick}
        />
      )}
    />
  );
};
