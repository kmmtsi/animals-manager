import { useTranslation } from "react-i18next";
import { Breeding } from "../../../utils/common/definitions";
import { fieldGapY, hover, infoBox, msgLikeBtn } from "../../../utils/css";
import { BreedingGrid } from "../../breeding/BreedingGrid";

type Label = "breedingsAsParent" | "breedingAsChild";

export type HandleBreedingClick = {
  breeding: (breedingId: string) => void;
  create: (label: Label) => void;
};

export const AnimalBreedingField = ({
  label,
  breedingIds,
  allBreedings,
  handleBreedingClick,
}: {
  label: Label;
  breedingIds: string[];
  allBreedings: Breeding[];
  handleBreedingClick: HandleBreedingClick;
}) => {
  const { t } = useTranslation();
  return (
    <div className={fieldGapY}>
      <div>{t(label)}</div>
      {breedingIds.length > 0 ? (
        breedingIds.map((breedingId, i) => {
          const breeding = allBreedings.find(
            (breeding) => breeding.id === breedingId
          ) as Breeding;
          return (
            <button
              key={i}
              type="button"
              className={`block w-full ${infoBox} ${hover}`}
              onClick={() => {
                handleBreedingClick.breeding(breedingId);
              }}
            >
              <BreedingGrid key={i} miniBreeding={breeding} />
            </button>
          );
        })
      ) : (
        <button
          type="button"
          onClick={() => handleBreedingClick.create(label)}
          className={msgLikeBtn}
        >
          {t("createBreeding")}
        </button>
      )}
    </div>
  );
};
