import { useTranslation } from "react-i18next";
import { Breeding } from "../../../utils/common/definitions";
import { Items } from "../../generalUI/animalAndBreeding/items/Items";
import { HandleItemClick } from "../../generalUI/animalAndBreeding/items/tableView/Table";
import { HandleDeleteItems } from "../../generalUI/animalAndBreeding/items/tableView/TableMenuLeft";
import { TableView } from "../../generalUI/animalAndBreeding/items/tableView/TableView";

export const BreedingsBase = ({
  breedings,
  handleDeleteBreedings,
  handleBreedingClick,
  hideCheckbox,
}: {
  breedings: Breeding[];
  handleDeleteBreedings: HandleDeleteItems<Breeding>;
  handleBreedingClick: HandleItemClick;
  hideCheckbox?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Items
      items={breedings}
      renderNoItem={() => <div>{t("noBreeding")}</div>}
      renderTableView={() => (
        <TableView
          type="breedings"
          items={breedings}
          handleDeleteItems={handleDeleteBreedings}
          handleItemClick={handleBreedingClick}
          hideCheckbox={hideCheckbox}
        />
      )}
    />
  );
};
