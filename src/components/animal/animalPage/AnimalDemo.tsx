import { Dispatch, SetStateAction } from "react";
import { handleUpdateAnimalForm } from "../../../utils/animal/updateAnimal";
import {
  Animal,
  Breeding,
  MiniAnimal,
} from "../../../utils/common/definitions";
import {
  DemoWindow,
  demoUserId,
} from "../../landingPage/tryMe/tryMeUtils/tryMeUtils";
import { AnimalBase } from "./AnimalBase";

export const AnimalDemo = ({
  currentAnimal,
  allAnimals,
  allBreedings,
  setCurrentAnimal,
  setCurrentBreeding,
  setAllAnimals,
  setAllBreedings,
  setParents,
  setChildren,
  setCurrentWindow,
}: {
  currentAnimal: Animal;
  allAnimals: Animal[];
  allBreedings: Breeding[];
  setCurrentAnimal: Dispatch<SetStateAction<Animal>>;
  setCurrentBreeding: Dispatch<SetStateAction<Breeding>>;
  setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
  setAllBreedings: Dispatch<SetStateAction<Breeding[]>>;
  setParents: Dispatch<SetStateAction<MiniAnimal[]>>;
  setChildren: Dispatch<SetStateAction<MiniAnimal[]>>;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
}) => {
  return (
    <AnimalBase
      animal={currentAnimal}
      allAnimals={allAnimals}
      allBreedings={allBreedings}
      allAnimalsFolders={[]}
      disableBackBtn={true}
      deleteItemBtnConfig={undefined}
      handleUpdateAnimal={async (data, prevAnimal) => {
        await handleUpdateAnimalForm(
          data,
          demoUserId,
          allAnimals,
          allBreedings,
          prevAnimal,
          {
            setters: {
              setCurrentAnimal,
              setAllAnimals,
              setAllBreedings,
            },
          }
        );
      }}
      handleBreedingClick={{
        breeding: (breedingId) => {
          const breeding = allBreedings.find(
            (breeding) => breeding.id === breedingId
          ) as Breeding;
          setCurrentBreeding(breeding);
          setCurrentWindow("breedingPage");
        },
        create: (label) => {
          const miniAnimal = {
            id: currentAnimal.id,
            name: currentAnimal.name,
            sex: currentAnimal.sex,
          };
          label === "breedingAsChild"
            ? setChildren([miniAnimal])
            : setParents([miniAnimal]);
          setCurrentWindow("createBreeding");
        },
      }}
    />
  );
};
