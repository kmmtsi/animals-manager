import { Dispatch, SetStateAction } from "react";
import { handleUpdateBreedingForm } from "../../../utils/breeding/updateBreeding";
import { Animal, Breeding } from "../../../utils/common/definitions";
import {
  DemoWindow,
  demoUserId,
} from "../../landingPage/tryMe/tryMeUtils/tryMeUtils";
import { BreedingBase } from "./BreedingBase";

export const BreedingDemo = ({
  breeding,
  allAnimals,
  allBreedings,
  setAllAnimals,
  setAllBreedings,
  setCurrentBreeding,
  setCurrentAnimal,
  setCurrentWindow,
}: {
  breeding: Breeding;
  allAnimals: Animal[];
  allBreedings: Breeding[];
  setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
  setAllBreedings: Dispatch<SetStateAction<Breeding[]>>;
  setCurrentBreeding: Dispatch<SetStateAction<Breeding>>;
  setCurrentAnimal: Dispatch<SetStateAction<Animal>>;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
}) => {
  return (
    <BreedingBase
      breeding={breeding}
      allAnimals={allAnimals}
      onAnimalClick={(animalId) => {
        setCurrentAnimal(
          allAnimals.find((animal) => animal.id === animalId) as Animal
        );
        setCurrentWindow("animalPage");
      }}
      handleUpdateBreeding={async (data) => {
        handleUpdateBreedingForm(
          data,
          demoUserId,
          allAnimals,
          allBreedings,
          breeding,
          {
            setters: { setAllAnimals, setAllBreedings, setCurrentBreeding },
          }
        );
      }}
      allBreedingsFolders={[]}
      disableBackBtn={true}
    />
  );
};
