import { setDoc } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { Animal, Sex } from "../common/definitions";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/utils";
import { createAnimal } from "./createAnimal";

type Props = {
  name: string;
  sex: Sex;
  note: string;
  userId: string;
  allAnimals: Animal[];
  animalsMutator: KeyedMutator<Animal[]>;
};

export const handleCreateAnimal = async ({
  name,
  sex,
  note,
  userId,
  allAnimals,
  animalsMutator,
}: Props) => {
  const animal = createAnimal({ name, sex, note }, userId);

  await setDoc(getRef(userId, "animals", animal.id), animal);

  modifyCopiedDocs("created", animal, allAnimals);

  mutateDocs(animalsMutator, allAnimals);
};
