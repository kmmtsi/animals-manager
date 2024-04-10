import { Dispatch, SetStateAction } from "react";
import { Animal } from "../../../utils/common/definitions";
import { DemoWindow } from "../../landingPage/tryMe/tryMeUtils/tryMeUtils";
import { AnimalsBase } from "./AnimalsBase";

export const AnimalsDemo = ({
  allAnimals,
  setCurrentAnimal,
  setCurrentWindow,
}: {
  allAnimals: Animal[];
  setCurrentAnimal: Dispatch<SetStateAction<Animal>>;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
}) => {
  return (
    <AnimalsBase
      animals={allAnimals}
      handleDeleteAnimals={async () => {}}
      hideCheckbox={true}
      handleAnimalClick={(id) => {
        const animal = allAnimals.find((animal) => animal.id === id) as Animal;
        setCurrentAnimal(animal);
        setCurrentWindow("animalPage");
      }}
    />
  );
};
