import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { updateAnimal } from "../animal/updateAnimal";
import { getAnimalById } from "../animal/utils";
import { Animal, MiniAnimal, Pair } from "../common/definitions";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/utils";
import { db } from "../firebase";
import { updatePair } from "./updatePair";
import { isMemberIncluded } from "./utils";

// 変更がない場合は何もしない

export const handleUpdatePair = async (
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
  },
  prevPair: Pair
) => {
  const batch = writeBatch(db);

  const copiedAllAnimals = [...allAnimals];
  const copiedAllPairs = [...allPairs];

  // pairの処理
  const pair = updatePair(data, userId, prevPair);
  modifyCopiedDocs("updated", pair, copiedAllPairs);
  batch.set(getRef(userId, "pairs", pair.id), pair);

  // animalの処理
  const commonFunc = (updatedAnimal: Animal) => {
    modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
  };

  // 新pairedAnimals
  pair.pairedAnimals.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, prevPair.pairedAnimals)) {
      // 新メンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      const updatedAnimal = updateAnimal(
        {
          selfPairs: [...prevAnimal.selfPairs, pair.id],
        },
        userId,
        prevAnimal
      );
      commonFunc(updatedAnimal);
    }
  });

  // 旧pairedAnimals
  prevPair.pairedAnimals.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, pair.pairedAnimals)) {
      // 除外されたメンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      const updatedAnimal = updateAnimal(
        {
          selfPairs: prevAnimal.selfPairs.filter((id) => id !== pair.id),
        },
        userId,
        prevAnimal
      );
      commonFunc(updatedAnimal);
    }
  });

  // 新children
  pair.children.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, prevPair.children)) {
      // 新メンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      const updatedAnimal = updateAnimal(
        {
          sourcePair: pair.id,
        },
        userId,
        prevAnimal
      );
      commonFunc(updatedAnimal);
    }
  });

  // 旧children
  prevPair.children.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, pair.children)) {
      // 除外されたメンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      const updatedAnimal = updateAnimal(
        {
          sourcePair: "",
        },
        userId,
        prevAnimal
      );
      commonFunc(updatedAnimal);
    }
  });

  await batch.commit();

  mutateDocs(mutators.pairMutator, copiedAllPairs);
  mutateDocs(mutators.animalMutator, copiedAllAnimals);
};
