import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import { updateAnimal } from "../animal/updateAnimal";
import { updateBreeding } from "../breeding/updateBreeding";
import {
  getNewRef,
  getRef,
  getTimestamp,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import {
  Animal,
  Breeding,
  Folder,
  FolderFormData,
} from "../common/definitions";
import { db } from "../firebase";

export const createFolder = (
  data: FolderFormData & { id: string },
  userId: string
) => {
  const { id, name, itemIds, note } = data;
  const folder: Folder = {
    id,
    name,
    itemIds,
    note,
    createdAt: getTimestamp(),
    createdBy: userId,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };
  console.log(folder);
  return folder;
};

export const handleCreateFolderForm = async <T extends Animal | Breeding>(
  type: T extends Animal ? "animalsFolder" : "breedingsFolder",
  data: FolderFormData,
  userId: string,
  allItems: T[],
  allFolders: Folder[],
  itemsMutator: KeyedMutator<T[]>,
  foldersMutator: KeyedMutator<Folder[]>
) => {
  const batch = writeBatch(db);

  // folderの作成
  const ref = getNewRef(userId, `${type}s`);
  const createdFolder = createFolder({ id: ref.id, ...data }, userId);
  batch.set(ref, createdFolder);

  const copiedAllItems: T[] = [...allItems];

  // itemの更新
  createdFolder.itemIds.forEach((itemId) => {
    const prevItem = allItems.find((item) => item.id === itemId) as T;
    const updatedItem =
      type === "animalsFolder"
        ? updateAnimal(
            {
              folderIds: [...(prevItem as Animal).folderIds, createdFolder.id],
            },
            userId,
            prevItem as Animal
          )
        : updateBreeding(
            {
              folderIds: [
                ...(prevItem as Breeding).folderIds,
                createdFolder.id,
              ],
            },
            userId,
            prevItem as Breeding
          );

    batch.set(
      getRef(
        userId,
        type === "animalsFolder" ? "animals" : "breedings",
        updatedItem.id
      ),
      updatedItem
    );
    modifyCopiedDocs("updated", updatedItem, copiedAllItems);
  });

  await batch.commit();

  mutateDocs(foldersMutator, [...allFolders, createdFolder]);
  mutateDocs(itemsMutator, copiedAllItems);

  return createdFolder.id;
};