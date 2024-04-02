import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import { handleUpdateAnimalForm } from "../../../utils/animal/updateAnimal";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  Animal,
  AnimalFormData,
  Breeding,
} from "../../../utils/common/definitions";
import { useToast } from "../../generalUI/toast/useToast";
import { AnimalForm } from "../AnimalForm";

export const AnimalUpdate = ({
  prevAnimal,
  setIsUpdate,
  allAnimals,
  allBreedings,
  animalsMutator,
  breedingsMutator,
}: {
  prevAnimal: Animal;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allAnimals: Animal[];
  allBreedings: Breeding[];
  animalsMutator: KeyedMutator<Animal[]>;
  breedingsMutator: KeyedMutator<Breeding[]>;
}) => {
  const user = useOutletContext<User>();
  const showToast = useToast();
  const { t } = useTranslation();

  return (
    <AnimalForm
      defaultName={prevAnimal.name}
      defaultSex={prevAnimal.sex}
      defaultNote={prevAnimal.note}
      submitBtnText={t("update")}
      onCancelClick={() => {
        setIsUpdate(false);
      }}
      formOperation={async (data) => {
        try {
          await handleUpdateAnimalForm(
            data as AnimalFormData,
            user.uid,
            allAnimals,
            allBreedings,
            animalsMutator,
            breedingsMutator,
            prevAnimal
          );
          showToast(t("animalUpdated"));
          setIsUpdate(false);
        } catch (err) {
          showToast(convertErrToMsg(err));
        }
      }}
    />
  );
};
