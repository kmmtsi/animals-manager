import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import useSWR from "swr";
import { State } from "../../components/generalUI/animalAndBreeding/items/tableView/TableMenuLeft";
import { FolderFormProps } from "../../components/folder/base/FolderForm";
import { useToast } from "../../components/generalUI/toast/useToast";
import i18n from "../../i18n/config";
import { Animal, Breeding, Folder } from "../common/definitions";
import { db } from "../firebase";

export const getBreedingsFolderById = (id: string, folders: Folder[]) => {
  const folder = folders.find((f) => f.id === id);
  if (folder) {
    return folder;
  } else {
    throw new Error(i18n.t("breedingFolderNotFound"));
  }
};

export const useFetchBreedingsFolders = (userId: string) => {
  const {
    data: allBreedingsFolders,
    isLoading: isLoadingBreedingsFolders,
    error: breedingsFoldersErr,
    mutate: breedingsFoldersMutator,
  } = useSWR(
    "breedingsFolders",
    async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "breedingsFolders")
        );
        const data = querySnapshot.docs.map((doc) => doc.data()) as Folder[];
        return data;
      } catch (err) {
        throw new Error(i18n.t("dbReadErr"));
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    allBreedingsFolders,
    isLoadingBreedingsFolders,
    breedingsFoldersErr,
    breedingsFoldersMutator,
  };
};

export const useFetchAnimalsFolders = (userId: string) => {
  const {
    data: allAnimalsFolders,
    isLoading: isLoadingAnimalsFolders,
    error: animalsFoldersErr,
    mutate: animalsFoldersMutator,
  } = useSWR(
    "animalsFolders",
    async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "animalsFolders")
        );
        const data = querySnapshot.docs.map((doc) => doc.data()) as Folder[];
        return data;
      } catch (err) {
        throw new Error(i18n.t("dbReadErr"));
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    allAnimalsFolders,
    isLoadingAnimalsFolders,
    animalsFoldersErr,
    animalsFoldersMutator,
  };
};

// export type BrFolderFsToS = Record<keyof Omit<BreedingsFolder, "id">, boolean>;

// export const getDefaultBrPlanFsToS = (): BrFolderFsToS => ({
//   breedings: true,
//   name: true,
//   note: true,
//   createdAt: true,
//   createdBy: true,
//   updatedAt: true,
//   updatedBy: true,
// });

export const useFolderForm = <T extends Animal | Breeding>(arg?: {
  prevFolder?: Folder;
}) => {
  const authUser = useOutletContext<User>();
  const showToast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const selectedItemIds = (useLocation().state as State)?.selectedItemIds;

  const [itemIds, setItemIds] = useState<string[]>(
    arg?.prevFolder?.itemIds ?? selectedItemIds ?? []
  );

  const folderFormProps: Pick<
    FolderFormProps<T>,
    "defaultName" | "defaultNote" | "itemIds" | "setItemIds"
  > = {
    defaultName: arg?.prevFolder?.name ?? "",
    defaultNote: arg?.prevFolder?.note ?? "",
    itemIds,
    setItemIds,
  };

  return {
    folderFormProps,
    userId: authUser.uid,
    showToast,
    navigate,
    t,
  };
};
