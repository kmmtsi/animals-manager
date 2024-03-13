import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { Animal, Pair, Sex } from "../common/definitions";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/utils";
import { db } from "../firebase";
import { updatePair } from "../pair/updatePair";
import { getPairById } from "../pair/utils";
import { updateAnimal } from "./updateAnimal";

type Props = {
  name: string;
  sex: Sex;
  note: string;
  userId: string;
  allAnimals: Animal[];
  allPairs: Pair[];
  animalsMutator: KeyedMutator<Animal[]>;
  pairsMutator: KeyedMutator<Pair[]>;
  prevAnimal: Animal;
};

export const handleUpdateAnimal = async ({
  name,
  sex,
  note,
  userId,
  allAnimals,
  allPairs,
  animalsMutator,
  pairsMutator,
  prevAnimal,
}: Props) => {
  const batch = writeBatch(db);

  // animalを更新
  const animal = updateAnimal({ name, sex, note }, userId, prevAnimal);

  batch.set(getRef(userId, "animals", animal.id), animal);

  let copiedAllPairs: Pair[] = [];

  if (name !== prevAnimal.name || sex !== prevAnimal.sex) {
    copiedAllPairs = [...allPairs];

    // nameまたはsexが変更されている場合
    // 紐づくペア内の自分の情報も更新する
    const miniAnimal = { id: animal.id, name: animal.name, sex: animal.sex };

    /**************
     * sourcePair *
     **************/
    const sourcePairId = prevAnimal.sourcePair;

    if (sourcePairId !== "") {
      // sourcePairのオリジナルを更新
      const prevPair = getPairById(sourcePairId, allPairs);

      // 入れ替え
      const newChildren = prevPair.children.map((child) =>
        child.id === animal.id ? miniAnimal : child
      );

      const newPair = updatePair({ children: newChildren }, userId, prevPair);

      batch.set(getRef(userId, "pairs", newPair.id), newPair);

      modifyCopiedDocs("updated", newPair, copiedAllPairs);
    }

    /**************
     * selfPairs *
     **************/
    animal.selfPairs.forEach((selfPairId) => {
      const prevPair = getPairById(selfPairId, allPairs);

      // 入れ替え
      const newPairedAnimals = prevPair.pairedAnimals.map((pairedAnimal) =>
        pairedAnimal.id === animal.id ? miniAnimal : pairedAnimal
      );

      const newPair = updatePair(
        { pairedAnimals: newPairedAnimals },
        userId,
        prevPair
      );

      batch.set(getRef(userId, "pairs", newPair.id), newPair);

      modifyCopiedDocs("updated", newPair, copiedAllPairs);
    });
  }

  await batch.commit();

  modifyCopiedDocs("updated", animal, allAnimals);
  mutateDocs(animalsMutator, allAnimals);

  copiedAllPairs.length > 0 && mutateDocs(pairsMutator, copiedAllPairs);
};
