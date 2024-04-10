import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animal } from "../../../utils/common/definitions";
import { FormOperation } from "../../generalUI/form/Form";
import { AnimalForm } from "../AnimalForm";

export const AnimalUpdate = ({
  animal,
  setIsUpdate,
  allAnimals,
  formOperation,
}: {
  animal: Animal;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allAnimals: Animal[];
  formOperation: FormOperation;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(animal.name);

  return (
    <AnimalForm
      name={name}
      prevName={animal.name}
      setName={setName}
      defaultSex={animal.sex}
      defaultNote={animal.note}
      defaultDateOfBirth={animal.dateOfBirth}
      defaultHealthCondition={animal.healthCondition}
      allAnimals={allAnimals}
      submitBtnText={t("update")}
      onCancelClick={() => {
        setIsUpdate(false);
      }}
      formOperation={formOperation}
    />
  );
};
