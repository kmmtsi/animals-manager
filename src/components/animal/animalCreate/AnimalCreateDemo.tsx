import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { createAnimal } from "../../../utils/animal/createAnimal";
import { getTimestamp } from "../../../utils/common/commonUtils";
import { Animal, AnimalFormData } from "../../../utils/common/definitions";
import { useToast } from "../../generalUI/toast/useToast";
import {
  DemoWindow,
  demoUserId,
} from "../../landingPage/tryMe/tryMeUtils/tryMeUtils";
import { AnimalCreate } from "./AnimalCreate";

export const AnimalCreateDemo = ({
  name,
  setName,
  setCurrentWindow,
  setAllAnimals,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
  setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
}) => {
  const showToast = useToast();
  const { t } = useTranslation();

  return (
    <AnimalCreate
      name={name}
      setName={setName}
      allAnimals={[]} // サジェストに使われるだけなので今回は使わない
      onCancelClick={null}
      formOperation={(data) => {
        const animal = createAnimal(
          { id: getTimestamp(), formData: data as AnimalFormData },
          demoUserId
        );
        setAllAnimals((prev) => [animal, ...prev]);
        showToast(t("animalCreated"));
        setName("");
        setCurrentWindow("allAnimals");
      }}
    />
  );
};
