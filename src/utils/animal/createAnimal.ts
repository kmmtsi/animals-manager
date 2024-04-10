import { setDoc } from "firebase/firestore";
import { KeyedMutator } from "swr";
import {
  getNewRef,
  getTimestamp,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import { Animal, AnimalFormData } from "../common/definitions";

export const createAnimal = (
  data: { id: string; formData: AnimalFormData },
  userId: string
) => {
  const animal: Animal = {
    id: data.id,
    ...data.formData,
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
  const ref = getNewRef(userId, "animals");
  const animal = createAnimal({ id: ref.id, formData: data }, userId);

  await setDoc(ref, animal);

  const copiedAllAnimals = [...allAnimals];
  modifyCopiedDocs("created", animal, copiedAllAnimals);
  mutateDocs(animalsMutator, copiedAllAnimals);
};
