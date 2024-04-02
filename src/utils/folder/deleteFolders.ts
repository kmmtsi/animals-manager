import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { updateAnimalOnLeavingFolder } from "../animal/updateAnimal";
import { updateBreedingByRemovingFolder } from "../breeding/updateBreeding";
import { getRef, modifyCopiedDocs, mutateDocs } from "../common/commonUtils";
import { Animal, Breeding, Folder } from "../common/definitions";
import { db } from "../firebase";

export const handleDeleteFolders = async <T extends Animal | Breeding>(
  type: T extends Animal ? "animalsFolders" : "breedingsFolders",
  folders: Folder[],
  userId: string,
  allFolders: Folder[],
  allItems: T[],
  foldersMutator: KeyedMutator<Folder[]>,
  itemsMutator: KeyedMutator<T[]>
) => {
  const batch = writeBatch(db);

  const copiedAllFolders = [...allFolders];
  const updatedItems: T[] = [];

  folders.forEach((deletedFolder) => {
    batch.delete(getRef(userId, type, deletedFolder.id));
    modifyCopiedDocs("deleted", deletedFolder, copiedAllFolders);

    // itemsの更新
    deletedFolder.itemIds.forEach((itemId) => {
      let isFirstUpdate = true;
      let prevItem = updatedItems.find((item) => item.id === itemId);

      if (prevItem) {
        isFirstUpdate = false;
      } else {
        prevItem = allItems.find((item) => item.id === itemId) as T;
      }

      const newItem =
        type === "animalsFolders"
          ? (updateAnimalOnLeavingFolder(
              prevItem as Animal,
              deletedFolder.id,
              userId
            ) as T)
          : (updateBreedingByRemovingFolder(
              prevItem as Breeding,
              deletedFolder.id,
              userId
            ) as T);

      if (isFirstUpdate) {
        updatedItems.push(newItem);
      } else {
        prevItem = newItem;
      }
    });
  });

  const copiedAllItems = updatedItems.length ? [...allItems] : null;
  copiedAllItems &&
    updatedItems.forEach((item) => {
      batch.set(
        getRef(
          userId,
          type === "animalsFolders" ? "animals" : "breedings",
          item.id
        ),
        item
      );
      modifyCopiedDocs("updated", item, copiedAllItems);
    });

  await batch.commit();

  mutateDocs(foldersMutator, copiedAllFolders);
  copiedAllItems && mutateDocs(itemsMutator, copiedAllItems);
};
