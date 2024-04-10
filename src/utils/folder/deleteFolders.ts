import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { updateAnimalOnLeavingFolder } from "../animal/updateAnimal";
import { updateBreedingOnLeavingFolder } from "../breeding/updateBreeding";
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
      const index = updatedItems.findIndex((item) => item.id === itemId);

      if (index === -1) {
        const prevItem = allItems.find((item) => item.id === itemId) as T;
        const newItem =
          type === "animalsFolders"
            ? (updateAnimalOnLeavingFolder(
                prevItem as Animal,
                deletedFolder.id,
                userId
              ) as T)
            : (updateBreedingOnLeavingFolder(
                prevItem as Breeding,
                deletedFolder.id,
                userId
              ) as T);
        updatedItems.push(newItem);
      } else {
        updatedItems[index] =
          type === "animalsFolders"
            ? (updateAnimalOnLeavingFolder(
                updatedItems[index] as Animal,
                deletedFolder.id,
                userId
              ) as T)
            : (updateBreedingOnLeavingFolder(
                updatedItems[index] as Breeding,
                deletedFolder.id,
                userId
              ) as T);
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
