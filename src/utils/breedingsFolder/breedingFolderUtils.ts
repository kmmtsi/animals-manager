import { collection, getDocs } from "firebase/firestore";
import useSWR from "swr";
import i18n from "../../i18n/config";
import { Folder } from "../common/definitions";
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
    "breedingFolders",
    async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "breedingFolders")
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
