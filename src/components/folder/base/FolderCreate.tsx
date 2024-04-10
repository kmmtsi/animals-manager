import { KeyedMutator } from "swr";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  Animal,
  Breeding,
  Folder,
  FolderFormData,
} from "../../../utils/common/definitions";
import {
  getPathToAllAnimalsFolders,
  getPathToAllBreedingsFolders,
  getPathToAnimalsFolderPage,
  getPathToBreedingsFolderPage,
} from "../../../utils/common/pageUtils";
import { pageGapY, pageTitle } from "../../../utils/css";
import { handleCreateFolderForm } from "../../../utils/folder/createFolder";
import { useFolderForm } from "../../../utils/folder/folderUtils";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { FolderForm } from "./FolderForm";

export const FolderCreate = <T extends Animal | Breeding>({
  type,
  allFolders,
  allItems,
  foldersMutator,
  itemsMutator,
}: {
  type: T extends Animal ? "animalsFolder" : "breedingsFolder";
  allFolders: Folder[];
  allItems: T[];
  foldersMutator: KeyedMutator<Folder[]>;
  itemsMutator: KeyedMutator<T[]>;
}) => {
  const { folderFormProps, userId, showToast, navigate, t } = useFolderForm();

  return (
    <div className={pageGapY}>
      <Breadcrumb
        page={
          type === "animalsFolder"
            ? "animalsFolderCreate"
            : "breedingsFolderCreate"
        }
      />
      <h1 className={pageTitle}>{t("createFolder")}</h1>
      <FolderForm
        type={type}
        {...folderFormProps}
        allItems={allItems}
        submitBtnText="createNew"
        onCancelClick={() =>
          navigate(
            type === "animalsFolder"
              ? getPathToAllAnimalsFolders()
              : getPathToAllBreedingsFolders()
          )
        }
        formOperation={async (data) => {
          try {
            const folderId = await handleCreateFolderForm(
              type,
              {
                ...(data as Omit<FolderFormData, "itemIds">),
                itemIds: folderFormProps.itemIds,
              },
              userId,
              allItems,
              allFolders,
              itemsMutator,
              foldersMutator
            );
            showToast(t("folderCreated"));
            navigate(
              type === "animalsFolder"
                ? getPathToAnimalsFolderPage(folderId)
                : getPathToBreedingsFolderPage(folderId)
            );
          } catch (err) {
            showToast(convertErrToMsg(err));
          }
        }}
      />
    </div>
  );
};
