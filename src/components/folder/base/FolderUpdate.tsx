import { Dispatch, SetStateAction } from "react";
import { KeyedMutator } from "swr";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  Animal,
  Breeding,
  Folder,
  FolderFormData,
} from "../../../utils/common/definitions";
import { useFolderForm } from "../../../utils/folder/folderUtils";
import { handleUpdateFolderForm } from "../../../utils/folder/updateFolder";
import { FolderForm } from "./FolderForm";

export const FolderUpdate = <T extends Animal | Breeding>({
  type,
  prevFolder,
  setIsUpdate,
  allItems,
  allFolders,
  itemsMutator,
  foldersMutator,
}: {
  type: T extends Animal ? "animalsFolder" : "breedingsFolder";
  prevFolder: Folder;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allItems: T[];
  allFolders: Folder[];
  itemsMutator: KeyedMutator<T[]>;
  foldersMutator: KeyedMutator<Folder[]>;
}) => {
  const { folderFormProps, userId, showToast, t } = useFolderForm({
    prevFolder,
  });

  return (
    <FolderForm
      type={type}
      {...folderFormProps}
      allItems={allItems}
      submitBtnText="update"
      onCancelClick={() => setIsUpdate(false)}
      formOperation={async (data) => {
        try {
          await handleUpdateFolderForm(
            type,
            {
              ...(data as Omit<FolderFormData, "itemIds">),
              itemIds: folderFormProps.itemIds,
            },
            prevFolder,
            userId,
            allItems,
            allFolders,
            itemsMutator,
            foldersMutator
          );
          showToast(t("folderUpdated"));
          setIsUpdate(false);
        } catch (err) {
          showToast(convertErrToMsg(err));
        }
      }}
    />
  );
};
