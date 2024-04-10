import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { handleCreateBreedingForm } from "../../../utils/breeding/createBreeding";
import {
  Animal,
  Breeding,
  BreedingFormData,
  MiniAnimal,
} from "../../../utils/common/definitions";
import { useToast } from "../../generalUI/toast/useToast";
import {
  DemoWindow,
  demoUserId,
} from "../../landingPage/tryMe/tryMeUtils/tryMeUtils";
import { BreedingCreate } from "./BreedingCreate";

export const BreedingCreateDemo = ({
  allAnimals,
  parents,
  children,
  allBreedings,
  setParents,
  setChildren,
  setAllAnimals,
  setAllBreedings,
  setCurrentWindow,
}: {
  allAnimals: Animal[];
  parents: MiniAnimal[];
  children: MiniAnimal[];
  allBreedings: Breeding[];
  setParents: Dispatch<SetStateAction<MiniAnimal[]>>;
  setChildren: Dispatch<SetStateAction<MiniAnimal[]>>;
  setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
  setAllBreedings: Dispatch<SetStateAction<Breeding[]>>;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
}) => {
  const showToast = useToast();
  const { t } = useTranslation();

  return (
    <BreedingCreate
      allAnimals={allAnimals}
      parents={parents}
      children={children}
      setParents={setParents}
      setChildren={setChildren}
      onCancelClick={undefined}
      formOperation={async (data) => {
        handleCreateBreedingForm(
          {
            parents,
            children,
            ...(data as Omit<BreedingFormData, "parents" | "children">),
          },
          demoUserId,
          allAnimals,
          allBreedings,
          {
            setters: {
              setAllAnimals,
              setAllBreedings,
            },
          }
        );
        showToast(t("breedingCreated"));
        setParents([]);
        setChildren([]);
        setCurrentWindow("allBreedings");
      }}
    />
  );
};
