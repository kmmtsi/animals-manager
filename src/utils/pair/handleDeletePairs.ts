import { writeBatch } from "firebase/firestore";
import { Animal, Pair } from "../common/definitions";
import { getAnimalById } from "../animal/utils";
import { updateAnimal } from "../animal/updateAnimal";
import { deletePair } from "./deletePair";
import { db } from "../firebase";
import { KeyedMutator } from "swr";
import { mutateDocs } from "../common/utils";

export const handleDeletePairs = async (
  pairsToDelete: Pair[],
  userId: string,
  allPairs: Pair[],
  allAnimals: Animal[],
  mutators: {
    animalsMutator: KeyedMutator<Animal[]>;
    pairsMutator: KeyedMutator<Pair[]>;
  }
) => {
  const { animalsMutator, pairsMutator } = mutators;

  // batchを初期化
  const batch = writeBatch(db);

  // コピーを作成
  const copiedAllPairs = [...allPairs];
  const copiedAllAnimals = [...allAnimals];

  pairsToDelete.forEach((pairToDelete) => {
    /*******************
     * pairに関する処理 *
     *******************/
    deletePair(pairToDelete, userId, batch, copiedAllPairs);

    /*********************
     * animalに関する処理 *
     *********************/
    pairToDelete.pairedAnimals.forEach((animalId) => {
      const animalToUpdate = getAnimalById(animalId, copiedAllAnimals);
      updateAnimal(
        {
          selfPairs: animalToUpdate.selfPairs.filter(
            (id) => id !== pairToDelete.id
          ),
        },
        animalToUpdate,
        userId,
        batch,
        copiedAllAnimals
      );
    });

    pairToDelete.children.forEach((animalId) => {
      const animalToUpdate = getAnimalById(animalId, copiedAllAnimals);
      updateAnimal(
        {
          sourcePair: "",
        },
        animalToUpdate,
        userId,
        batch,
        copiedAllAnimals
      );
    });
  });

  await batch.commit();

  mutateDocs(pairsMutator, copiedAllPairs);
  mutateDocs(animalsMutator, copiedAllAnimals);
};
