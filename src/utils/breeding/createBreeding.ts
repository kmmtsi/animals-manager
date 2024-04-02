import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { getAnimalById } from "../animal/animalUtils";
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

const createBreeding = (data: BreedingFormData, userId: string) => {
  const breeding: Breeding = {
    id: getNewRef(userId, "breedings").id,
    parents: data.parents,
    children: data.children,
    status: data.status,
    note: data.note,
    startDate: data.startDate,
    endDate: data.endDate,
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
  animalsMutator: KeyedMutator<Animal[]>,
  breedingsMutator: KeyedMutator<Breeding[]>
) => {
  console.log(data)
  const batch = writeBatch(db);

  const copiedAllAnimals = [...allAnimals];
  const copiedAllBreedings = [...allBreedings];

  // breedingの処理
  const createdBreeding = createBreeding(data, userId);
  modifyCopiedDocs("created", createdBreeding, copiedAllBreedings);
  batch.set(getRef(userId, "breedings", createdBreeding.id), createdBreeding);

  // animalの処理
  createdBreeding.parents.forEach((parent) => {
    const prevAnimal = getAnimalById(parent.id, allAnimals);
    const updatedAnimal = updateParentAnimalOnAddedToBreeding(
      prevAnimal,
      createdBreeding.id,
      userId
    );

    modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
  });

  createdBreeding.children.forEach((child) => {
    const prevAnimal = getAnimalById(child.id, allAnimals);
    const updatedAnimal = updateChildAnimalOnAddedToBreeding(
      prevAnimal,
      createdBreeding.id,
      userId
    );

    modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
  });

  await batch.commit();

  mutateDocs(breedingsMutator, copiedAllBreedings);
  mutateDocs(animalsMutator, copiedAllAnimals);
};
