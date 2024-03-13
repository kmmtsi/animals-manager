import { writeBatch } from "firebase/firestore";
import { Animal, Pair } from "../common/definitions";
import { db } from "../firebase";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/utils";
import { KeyedMutator } from "swr";
import { getPairById } from "../pair/utils";
import { updatePair } from "../pair/updatePair";

export const handleDeleteAnimal = async (
  animal: Animal,
  userId: string,
  allPairs: Pair[],
  allAnimals: Animal[],
  animalsMutator: KeyedMutator<Animal[]>,
  pairsMutator: KeyedMutator<Pair[]>
) => {
  const batch = writeBatch(db);

  // animalを削除
  batch.delete(getRef(userId, "animals", animal.id));

  let copiedAllPairs: Pair[] | undefined;

  if (animal.sourcePair || animal.selfPairs.length > 0) {
    copiedAllPairs = [...allPairs];

    // sourcePairのpairを更新
    if (animal.sourcePair) {
      const prevPair = getPairById(animal.sourcePair, allPairs);
      const updatedPair = updatePair(
        {
          children: prevPair.children.filter((child) => child.id !== animal.id),
        },
        userId,
        prevPair
      );
      batch.set(getRef(userId, "pairs", updatedPair.id), updatedPair);
      modifyCopiedDocs("updated", updatedPair, copiedAllPairs);
    }

    // selfPairsのpairを更新
    animal.selfPairs.forEach((selfPairId) => {
      const prevPair = getPairById(selfPairId, allPairs);
      const updatedPair = updatePair(
        {
          pairedAnimals: prevPair.pairedAnimals.filter(
            (pairedAnimal) => pairedAnimal.id !== animal.id
          ),
        },
        userId,
        prevPair
      );
      batch.set(getRef(userId, "pairs", updatedPair.id), updatedPair);
      modifyCopiedDocs("updated", updatedPair, copiedAllPairs as Pair[]);
    });
  }

  await batch.commit();

  modifyCopiedDocs("deleted", animal, allAnimals);
  mutateDocs(animalsMutator, allAnimals);
  copiedAllPairs && mutateDocs(pairsMutator, copiedAllPairs);
};
