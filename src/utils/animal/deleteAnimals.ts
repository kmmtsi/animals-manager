import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import {
  updateBreedingOnChildAnimalDeleted,
  updateBreedingOnParentAnimalDeleted,
} from "../breeding/updateBreeding";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/commonUtils";
import { Animal, Breeding, Folder } from "../common/definitions";
import { db } from "../firebase";
import { updateFolderOnItemDeleted } from "../folder/updateFolder";

export const handleDeleteAnimals = async (
  animals: Animal[],
  userId: string,
  allAnimals: Animal[],
  allBreedings: Breeding[],
  allFolders: Folder[],
  animalsMutator: KeyedMutator<Animal[]>,
  breedingsMutator: KeyedMutator<Breeding[]>,
  foldersMutator: KeyedMutator<Folder[]>
) => {
  const batch = writeBatch(db);

  const copiedAllAnimals = [...allAnimals];

  const updatedBreedings: Breeding[] = [];
  const updatedFolders: Folder[] = [];

  animals.forEach((deletedAnimal) => {
    // animalを削除
    batch.delete(getRef(userId, "animals", deletedAnimal.id));
    modifyCopiedDocs("deleted", deletedAnimal, copiedAllAnimals);

    // breedingを更新
    // breedingIdAsChild
    if (deletedAnimal.breedingIdAsChild) {
      const index = updatedBreedings.findIndex(
        (breeding) => breeding.id === deletedAnimal.breedingIdAsChild
      );

      if (index === -1) {
        const prevBreeding = allBreedings.find(
          (br) => br.id === deletedAnimal.breedingIdAsChild
        ) as Breeding;
        updatedBreedings.push(
          updateBreedingOnChildAnimalDeleted(
            prevBreeding,
            deletedAnimal.id,
            userId
          )
        );
      } else {
        updatedBreedings[index] = updateBreedingOnChildAnimalDeleted(
          updatedBreedings[index],
          deletedAnimal.id,
          userId
        );
      }
    }

    // breedingIdsAsParent
    deletedAnimal.breedingIdsAsParent.forEach((brId) => {
      const index = updatedBreedings.findIndex((br) => br.id === brId);

      if (index === -1) {
        const prevBreeding = allBreedings.find(
          (br) => br.id === brId
        ) as Breeding;
        updatedBreedings.push(
          updateBreedingOnParentAnimalDeleted(
            prevBreeding,
            deletedAnimal.id,
            userId
          )
        );
      } else {
        updatedBreedings[index] = updateBreedingOnParentAnimalDeleted(
          updatedBreedings[index],
          deletedAnimal.id,
          userId
        );
      }
    });

    // folderを更新
    deletedAnimal.folderIds.forEach((folderId) => {
      const index = updatedFolders.findIndex(
        (folder) => folder.id === folderId
      );

      if (index === -1) {
        const prevFolder = allFolders.find(
          (folder) => folder.id === folderId
        ) as Folder;
        updatedFolders.push(
          updateFolderOnItemDeleted(prevFolder, deletedAnimal.id, userId)
        );
      } else {
        updatedFolders[index] = updateFolderOnItemDeleted(
          updatedFolders[index],
          deletedAnimal.id,
          userId
        );
      }
    });
  });

  // breedings
  const copiedAllBreedings = updatedBreedings.length ? [...allBreedings] : null;
  copiedAllBreedings &&
    updatedBreedings.forEach((updatedBreeding) => {
      batch.set(
        getRef(userId, "breedings", updatedBreeding.id),
        updatedBreeding
      );
      modifyCopiedDocs("updated", updatedBreeding, copiedAllBreedings);
    });

  // folders
  const copiedAllFolders = updatedFolders.length ? [...allFolders] : null;
  copiedAllFolders &&
    updatedFolders.forEach((updatedFolder) => {
      batch.set(
        getRef(userId, "animalsFolders", updatedFolder.id),
        updatedFolder
      );
      modifyCopiedDocs("updated", updatedFolder, copiedAllFolders);
    });

  await batch.commit();

  mutateDocs(animalsMutator, copiedAllAnimals);
  copiedAllBreedings && mutateDocs(breedingsMutator, copiedAllBreedings);
  copiedAllFolders && mutateDocs(foldersMutator, copiedAllFolders);
};
