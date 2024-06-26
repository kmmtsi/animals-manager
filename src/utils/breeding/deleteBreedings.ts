import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import {
  updateChildAnimalOnLeavingBreeding,
  updateParentAnimalOnLeavingBreeding,
} from "../animal/updateAnimal";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/commonUtils";
import { Animal, Breeding, Folder } from "../common/definitions";
import { db } from "../firebase";
import { updateFolderOnItemDeleted } from "../folder/updateFolder";

export const handleDeleteBreedings = async (
  breedings: Breeding[],
  userId: string,
  allBreedings: Breeding[],
  allAnimals: Animal[],
  allFolders: Folder[],
  breedingsMutator: KeyedMutator<Breeding[]>,
  animalsMutator: KeyedMutator<Animal[]>,
  foldersMutator: KeyedMutator<Folder[]>
) => {
  // batchを初期化
  const batch = writeBatch(db);

  const copiedAllBreedings = [...allBreedings];

  const updatedAnimals: Animal[] = [];
  const updatedFolders: Folder[] = [];

  breedings.forEach((deletedBr) => {
    batch.delete(getRef(userId, "breedings", deletedBr.id));
    modifyCopiedDocs("deleted", deletedBr, copiedAllBreedings);

    // animalを更新
    deletedBr.parents.forEach((parent) => {
      const index = updatedAnimals.findIndex(
        (animal) => animal.id === parent.id
      );

      if (index === -1) {
        const prevAnimal = allAnimals.find(
          (animal) => animal.id === parent.id
        ) as Animal;
        updatedAnimals.push(
          updateParentAnimalOnLeavingBreeding(prevAnimal, deletedBr.id, userId)
        );
      } else {
        updatedAnimals[index] = updateParentAnimalOnLeavingBreeding(
          updatedAnimals[index],
          deletedBr.id,
          userId
        );
      }
    });

    deletedBr.children.forEach((child) => {
      const index = updatedAnimals.findIndex(
        (animal) => animal.id === child.id
      );

      if (index === -1) {
        const prevAnimal = allAnimals.find(
          (animal) => animal.id === child.id
        ) as Animal;
        updatedAnimals.push(
          updateChildAnimalOnLeavingBreeding(prevAnimal, userId)
        );
      } else {
        updatedAnimals[index] = updateChildAnimalOnLeavingBreeding(
          updatedAnimals[index],
          userId
        );
      }
    });

    // folderを更新
    deletedBr.folderIds.forEach((folderId) => {
      const index = updatedFolders.findIndex(
        (updatedFolder) => updatedFolder.id === folderId
      );

      if (index === -1) {
        const prevFolder = allFolders.find(
          (folder) => folder.id === folderId
        ) as Folder;
        updatedFolders.push(
          updateFolderOnItemDeleted(prevFolder, deletedBr.id, userId)
        );
      } else {
        updatedFolders[index] = updateFolderOnItemDeleted(
          updatedFolders[index],
          deletedBr.id,
          userId
        );
      }
    });
  });

  const copiedAllAnimals = updatedAnimals.length ? [...allAnimals] : null;
  copiedAllAnimals &&
    updatedAnimals.forEach((updatedAnimal) => {
      batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
      modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    });

  const copiedAllFolders = updatedFolders ? [...allFolders] : null;
  copiedAllFolders &&
    updatedFolders.forEach((updatedFolder) => {
      batch.set(
        getRef(userId, "breedingsFolders", updatedFolder.id),
        updatedFolder
      );
      modifyCopiedDocs("updated", updatedFolder, copiedAllFolders);
    });

  await batch.commit();

  mutateDocs(breedingsMutator, copiedAllBreedings);
  copiedAllAnimals && mutateDocs(animalsMutator, copiedAllAnimals);
  copiedAllFolders && mutateDocs(foldersMutator, copiedAllFolders);
};
