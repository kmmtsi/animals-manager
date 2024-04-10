import { writeBatch } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { KeyedMutator } from "swr";
import {
  updateChildAnimalOnAddedToBreeding,
  updateParentAnimalOnAddedToBreeding,
} from "../animal/updateAnimal";
import {
  getNewRef,
  getRef,
  getTimestamp,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import { Animal, Breeding, BreedingFormData } from "../common/definitions";
import { db } from "../firebase";

const createBreeding = (
  data: BreedingFormData & { id: string },
  userId: string
) => {
  const breeding: Breeding = {
    ...data,
    folderIds: [],
    createdAt: getTimestamp(),
    createdBy: userId,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };

  return breeding;
};

export const handleCreateBreedingForm = async (
  data: BreedingFormData,
  userId: string,
  allAnimals: Animal[],
  allBreedings: Breeding[],
  options: {
    mutators?: {
      animalsMutator: KeyedMutator<Animal[]>;
      breedingsMutator: KeyedMutator<Breeding[]>;
    };
    setters?: {
      setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
      setAllBreedings: Dispatch<SetStateAction<Breeding[]>>;
    };
  }
) => {
  const mutators = options.mutators;
  const setters = options.setters;

  const batch = mutators && writeBatch(db);

  // breedingの作成
  const ref = getNewRef(userId, "breedings");
  const createdBreeding = createBreeding({ id: ref.id, ...data }, userId);

  const updatedAnimals: Animal[] = [];

  // animalの処理
  createdBreeding.parents.forEach((parent) => {
    const prevAnimal = allAnimals.find(
      (animal) => animal.id === parent.id
    ) as Animal;
    updatedAnimals.push(
      updateParentAnimalOnAddedToBreeding(
        prevAnimal,
        createdBreeding.id,
        userId
      )
    );
  });

  createdBreeding.children.forEach((child) => {
    const prevAnimal = allAnimals.find(
      (animal) => animal.id === child.id
    ) as Animal;
    updatedAnimals.push(
      updateChildAnimalOnAddedToBreeding(prevAnimal, createdBreeding.id, userId)
    );
  });

  if (batch) {
    // breedingのバッチ処理
    batch.set(getRef(userId, "breedings", createdBreeding.id), createdBreeding);

    // animalのバッチ処理
    updatedAnimals.forEach((animal) => {
      batch.set(getRef(userId, "animals", animal.id), animal);
    });

    await batch.commit();
  }

  // breedingのmutate
  const copiedAllBreedings = [...allBreedings];
  modifyCopiedDocs("created", createdBreeding, copiedAllBreedings);

  if (mutators) {
    mutateDocs(mutators.breedingsMutator, copiedAllBreedings);
  }
  if (setters) {
    setters.setAllBreedings(copiedAllBreedings);
  }

  // animalのmutate
  if (updatedAnimals.length > 0) {
    const copiedAllAnimals = [...allAnimals];

    updatedAnimals.forEach((animal) => {
      modifyCopiedDocs("updated", animal, copiedAllAnimals);
    });

    if (mutators) {
      mutateDocs(mutators.animalsMutator, copiedAllAnimals);
    }
    if (setters) {
      setters.setAllAnimals(copiedAllAnimals);
    }
  }
};
