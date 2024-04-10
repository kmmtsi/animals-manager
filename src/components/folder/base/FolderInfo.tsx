import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import {
  getPathToAllAnimalsFolders,
  getPathToAllBreedingsFolders,
} from "../../../utils/common/pageUtils";
import { handleDeleteFolders } from "../../../utils/folder/deleteFolders";
import { Animals } from "../../animal/animals/Animals";
import { Breedings } from "../../breeding/breedings/Breedings";
import { ItemInfoBase } from "../../generalUI/animalAndBreeding/item/ItemInfoBase";

export const FolderInfo = <T extends Animal | Breeding>({
  type,
  folder,
  allFolders,
  allItems,
  foldersMutator,
  itemsMutator,
  setIsUpdate,
}: {
  type: T extends Animal ? "animalsFolder" : "breedingsFolder";
  folder: Folder;
  allFolders: Folder[];
  allItems: T[];
  foldersMutator: KeyedMutator<Folder[]>;
  itemsMutator: KeyedMutator<T[]>;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
}) => {
  const authUser = useOutletContext<User>();
  const { itemIds } = folder;

  const items = itemIds.map(
    (id) => allItems.find((item) => item.id === id) as T
  );

  return (
    <ItemInfoBase
      note={folder.note}
      createdAt={folder.createdAt}
      updatedAt={folder.updatedAt}
      setIsUpdateToTrue={() => setIsUpdate(true)}
      deleteItemBtnConfig={{
        label: "deleteFolder",
        handleDeleteItem: async () => {
          // 削除処理
          await handleDeleteFolders<T>(
            `${type}s` as T extends Animal
              ? "animalsFolders"
              : "breedingsFolders",
            [folder],
            authUser.uid,
            allFolders,
            allItems,
            foldersMutator,
            itemsMutator
          );
        },
        toastMsg: "folderDeleted",
        navigateTo:
          type === "animalsFolder"
            ? getPathToAllAnimalsFolders()
            : getPathToAllBreedingsFolders(),
      }}
      disableBackBtn={false}
    >
      {/* テーブル */}
      <div>
        {type === "animalsFolder" ? (
          <Animals animals={items as Animal[]} />
        ) : (
          <Breedings breedings={items as Breeding[]} />
        )}
      </div>
    </ItemInfoBase>
  );
};
