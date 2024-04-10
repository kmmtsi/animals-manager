import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { KeyedMutator } from "swr";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import { pageGapY, pageTitle } from "../../../utils/css";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { Msg } from "../../generalUI/Msg";
import { FolderInfo } from "./FolderInfo";
import { FolderUpdate } from "./FolderUpdate";

export const FolderPage = <T extends Animal | Breeding>({
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
  const { t } = useTranslation();
  const { folderId } = useParams();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const folder = allFolders.find((folder) => folder.id === folderId);

  if (folder) {
    return (
      <div className={pageGapY}>
        <Breadcrumb
          page={
            type === "animalsFolder"
              ? "animalsFolderPage"
              : "breedingsFolderPage"
          }
          dynamic={folder.name}
        />
        <h1 className={pageTitle}>{folder.name}</h1>
        {isUpdate ? (
          <FolderUpdate
            type={type}
            prevFolder={folder}
            setIsUpdate={setIsUpdate}
            allItems={allItems}
            allFolders={allFolders}
            itemsMutator={itemsMutator}
            foldersMutator={foldersMutator}
          />
        ) : (
          <FolderInfo
            type={type}
            folder={folder}
            allFolders={allFolders}
            allItems={allItems}
            foldersMutator={foldersMutator}
            itemsMutator={itemsMutator}
            setIsUpdate={setIsUpdate}
          />
        )}
      </div>
    );
  } else {
    return <Msg role="err">{t("folderNotFound")}</Msg>;
  }
};
