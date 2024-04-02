import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import i18n from "../../i18n/config";
import {
  updateAnimalOnAddedToFolder,
  updateAnimalOnLeavingFolder,
} from "../animal/updateAnimal";
import {
  updateBreedingByRemovingFolder,
  updateBreedingOnAddedToFolder,
} from "../breeding/updateBreeding";
import {
  CustomErr,
  getRef,
  getTimestamp,
  isArraysEqual,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import {
  Animal,
  Breeding,
  Folder,
  FolderFormData,
  FolderUpdateData,
} from "../common/definitions";
import { db } from "../firebase";

export const updateFolder = (
  data: FolderUpdateData,
  prevFolder: Folder,
  userId: string
) => {
  const { name, itemIds, note } = data;
  const folder: Folder = {
    ...prevFolder,
    name: name ?? prevFolder.name,
    itemIds: itemIds ?? prevFolder.itemIds,
    note: note ?? prevFolder.note,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };
  return folder;
};

export const updateFolderOnItemDeleted = (
  prevFolder: Folder,
  itemId: string,
  userId: string
) =>
  updateFolder(
    { itemIds: prevFolder.itemIds.filter((id) => id !== itemId) },
    prevFolder,
    userId
  );

export const handleUpdateFolderForm = async <T extends Animal | Breeding>(
  type: T extends Animal ? "animalsFolder" : "breedingsFolder",
  data: FolderFormData,
  prevFolder: Folder,
  userId: string,
  allItems: T[],
  allFolders: Folder[],
  itemsMutator: KeyedMutator<T[]>,
  foldersMutator: KeyedMutator<Folder[]>
) => {
  // TODO: folderに変更があるか確認
  let isNameChanged = false;
  let isItemsChanged = false;
  let isNoteChanged = false;

  if (data.name !== prevFolder.name) isNameChanged = true;
  if (!isArraysEqual(data.itemIds, prevFolder.itemIds)) isItemsChanged = true;
  if (data.note !== prevFolder.note) isNoteChanged = true;

  if (!isNameChanged && !isItemsChanged && !isNoteChanged) {
    throw new CustomErr(i18n.t("noChangeDetected"));
  }

  const batch = writeBatch(db);

  // folderの更新
  const updatedFolder = updateFolder(data, prevFolder, userId);
  batch.set(getRef(userId, `${type}s`, updatedFolder.id), updatedFolder);

  // animalの更新
  let copiedAllItems: T[] | undefined;
  if (isItemsChanged) {
    copiedAllItems = [...allItems];
    // 新
    updatedFolder.itemIds.forEach((itemId) => {
      if (!prevFolder.itemIds.includes(itemId)) {
        // 新しく追加されたitem
        const prevItem = allItems.find((item) => item.id === itemId) as T;
        const updatedItem =
          type === "animalsFolder"
            ? updateAnimalOnAddedToFolder(
                prevItem as Animal,
                updatedFolder.id,
                userId
              )
            : updateBreedingOnAddedToFolder(
                prevItem as Breeding,
                updatedFolder.id,
                userId
              );

        modifyCopiedDocs("updated", updatedItem, copiedAllItems as T[]);
        batch.set(
          getRef(
            userId,
            type === "animalsFolder" ? "animals" : "breedings",
            updatedItem.id
          ),
          updatedItem
        );
      }
    });
    // 旧
    prevFolder.itemIds.forEach((itemId) => {
      if (!updatedFolder.itemIds.includes(itemId)) {
        // 除外されたitem
        const prevItem = allItems.find((item) => item.id === itemId) as T;
        const updatedItem =
          type === "animalsFolder"
            ? updateAnimalOnLeavingFolder(
                prevItem as Animal,
                updatedFolder.id,
                userId
              )
            : updateBreedingByRemovingFolder(
                prevItem as Breeding,
                updatedFolder.id,
                userId
              );

        modifyCopiedDocs("updated", updatedItem, copiedAllItems as T[]);
        batch.set(
          getRef(
            userId,
            type === "animalsFolder" ? "animals" : "breedings",
            updatedItem.id
          ),
          updatedItem
        );
      }
    });
  }

  await batch.commit();

  // folderの処理
  const copiedAllFolders = [...allFolders];
  modifyCopiedDocs("updated", updatedFolder, copiedAllFolders);
  mutateDocs(foldersMutator, copiedAllFolders);

  copiedAllItems && mutateDocs(itemsMutator, copiedAllItems);
};
