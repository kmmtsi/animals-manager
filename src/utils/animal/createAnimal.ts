import { setDoc } from "firebase/firestore";
import { KeyedMutator } from "swr";
import {
  getNewRef,
  getRef,
  getTimestamp,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import { Animal, AnimalFormData } from "../common/definitions";

export const createAnimal = (data: AnimalFormData, userId: string) => {
  const animal: Animal = {
    id: getNewRef(userId, "animals").id,
    ...data,
    breedingIdAsChild: "",
    breedingIdsAsParent: [],
    folderIds: [],
    createdAt: getTimestamp(),
    createdBy: userId,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };
  return animal;
};

export const handleCreateAnimalForm = async (
  data: AnimalFormData,
  userId: string,
  allAnimals: Animal[],
  animalsMutator: KeyedMutator<Animal[]>
) => {
  const animal = createAnimal(data, userId);

  await setDoc(getRef(userId, "animals", animal.id), animal);

  const copiedAllAnimals = [...allAnimals];
  modifyCopiedDocs("created", animal, copiedAllAnimals);

  mutateDocs(animalsMutator, copiedAllAnimals);
};
