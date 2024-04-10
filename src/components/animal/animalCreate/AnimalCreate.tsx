import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Animal } from "../../../utils/common/definitions";
import { FormOperation } from "../../generalUI/form/Form";
import { AnimalForm, OnCancelClick } from "../AnimalForm";

export const AnimalCreate = ({
  name,
  setName,
  allAnimals,
  onCancelClick,
  formOperation,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  allAnimals: Animal[];
  onCancelClick: OnCancelClick;
  formOperation: FormOperation;
}) => {
  const { t } = useTranslation();

  return (
    <AnimalForm
      name={name}
      setName={setName}
      defaultSex=""
      defaultNote=""
      defaultHealthCondition="healthy"
      defaultDateOfBirth=""
      submitBtnText={t("createNew")}
      allAnimals={allAnimals}
      onCancelClick={onCancelClick}
      formOperation={formOperation}
    />
  );
};
