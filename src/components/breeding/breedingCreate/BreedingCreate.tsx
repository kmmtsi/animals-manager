import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Animal, MiniAnimal } from "../../../utils/common/definitions";
import { FormOperation } from "../../generalUI/form/Form";
import { BreedingForm, OnCancelClick } from "../BreedingForm";

export const BreedingCreate = ({
  allAnimals,
  parents,
  children,
  setParents,
  setChildren,
  onCancelClick,
  formOperation,
}: {
  allAnimals: Animal[];
  parents: MiniAnimal[];
  children: MiniAnimal[];
  setParents: Dispatch<SetStateAction<MiniAnimal[]>>;
  setChildren: Dispatch<SetStateAction<MiniAnimal[]>>;
  onCancelClick: OnCancelClick;
  formOperation: FormOperation;
}) => {
  const { t } = useTranslation();

  return (
    <BreedingForm
      parents={parents}
      children={children}
      defaultStatus=""
      defaultNote=""
      defaultStartDate=""
      defaultEndDate=""
      allAnimals={allAnimals}
      setParents={setParents}
      setChildren={setChildren}
      submitBtnText={t("createNew")}
      onCancelClick={onCancelClick}
      formOperation={formOperation}
    />
  );
};
