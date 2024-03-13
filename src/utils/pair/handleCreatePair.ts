import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { updateAnimal } from "../animal/updateAnimal";
import { getAnimalById } from "../animal/utils";
import { Animal, MiniAnimal, Pair } from "../common/definitions";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/utils";
import { db } from "../firebase";
import { createPair } from "./createPair";

export const handleCreatePair = async (
  data: {
    pairedAnimals: MiniAnimal[];
    children: MiniAnimal[];
  },
  userId: string,
  allAnimals: Animal[],
  allPairs: Pair[],
  mutators: {
    animalMutator: KeyedMutator<Animal[]>;
    pairMutator: KeyedMutator<Pair[]>;
  }
) => {
  const batch = writeBatch(db);

  const copiedAllAnimals = [...allAnimals];
  const copiedAllPairs = [...allPairs];

  // pairの処理
  const pair = createPair(data, userId);

  modifyCopiedDocs("created", pair, copiedAllPairs);
  batch.set(getRef(userId, "pairs", pair.id), pair);

  // animalの処理
  const commonFunc = (updatedAnimal: Animal) => {
    modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
  };

  pair.pairedAnimals.forEach((miniAnimal) => {
    const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
    const updatedAnimal = updateAnimal(
      {
        selfPairs: [...prevAnimal.selfPairs, pair.id],
      },
      userId,
      prevAnimal
    );
    commonFunc(updatedAnimal);
  });

  pair.children.forEach((miniAnimal) => {
    const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
    const updatedAnimal = updateAnimal(
      {
        sourcePair: pair.id,
      },
      userId,
      prevAnimal
    );
    commonFunc(updatedAnimal);
  });

  await batch.commit();

  mutateDocs(mutators.pairMutator, copiedAllPairs);
  mutateDocs(mutators.animalMutator, copiedAllAnimals);
};
