import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Animal, Breeding } from "../../../../utils/common/definitions";
import {
  getPathToAnimalCreate,
  getPathToBreedingCreate,
} from "../../../../utils/common/pageUtils";
import {
  btn,
  btnBlue,
  pageGapY,
  pageTitle,
  titleAndBtn,
} from "../../../../utils/css";
import { Animals } from "../../../animal/animals/Animals";
import { Breedings } from "../../../breeding/breedings/Breedings";
import { Breadcrumb } from "../../Breadcrumb";

export const AllItemsPage = <T extends Animal | Breeding>({
  type,
  allItems,
}: {
  type: T extends Animal ? "animals" : "breedings";
  allItems: T[];
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const titleText = type === "animals" ? "allAnimals" : "allBreedings";

  const pathToCreateItemPage =
    type === "animals" ? getPathToAnimalCreate() : getPathToBreedingCreate();

  return (
    <div className={pageGapY}>
      <Breadcrumb page={type} />
      <div className={titleAndBtn}>
        <h1 className={pageTitle}>{t(titleText)}</h1>
        {/* 新規作成ボタン */}
        <button
          type="button"
          className={`${btn} ${btnBlue}`}
          onClick={() => navigate(pathToCreateItemPage)}
        >
          {t("createNew")}
        </button>
      </div>
      {/* Items */}
      {type === "animals" ? (
        <Animals animals={allItems as Animal[]} />
      ) : (
        <Breedings breedings={allItems as Breeding[]} />
      )}
    </div>
  );
};
