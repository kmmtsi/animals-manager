import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import i18n from "../../i18n/config";
import { getAnimalById } from "../animal/animalUtils";
import {
  updateChildAnimalOnAddedToBreeding,
  updateChildAnimalOnLeavingBreeding,
  updateParentAnimalOnAddedToBreeding,
  updateParentAnimalOnLeavingBreeding,
} from "../animal/updateAnimal";
import {
  CustomErr,
  getRef,
  getTimestamp,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import {
  Animal,
  Breeding,
  BreedingFormData,
  BreedingUpdateData,
  MiniAnimal,
} from "../common/definitions";
import { db } from "../firebase";
import { isMemberIncluded, isMembersSame } from "./breedingUtils";

export const updateBreeding = (
  data: BreedingUpdateData,
  userId: string,
  prevBreeding: Breeding
) => {
  const { parents, children, status, startDate, endDate, note, folderIds } =
    data;

  const breeding: Breeding = {
    ...prevBreeding,
    parents: parents ?? prevBreeding.parents,
    children: children ?? prevBreeding.children,
    status: status ?? prevBreeding.status,
    startDate: startDate ?? prevBreeding.startDate,
    endDate: endDate ?? prevBreeding.endDate,
    note: note ?? prevBreeding.note,
    folderIds: folderIds ?? prevBreeding.folderIds,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };

  return breeding;
};

export const updateBreedingOnChildAnimalDeleted = (
  prevBreeding: Breeding,
  deletedAnimalId: string,
  userId: string
) =>
  updateBreeding(
    {
      children: prevBreeding.children.filter(
        (child) => child.id !== deletedAnimalId
      ),
    },
    userId,
    prevBreeding
  );

export const updateBreedingOnParentAnimalDeleted = (
  prevBreeding: Breeding,
  deletedAnimalId: string,
  userId: string
) =>
  updateBreeding(
    {
      parents: prevBreeding.parents.filter(
        (parent) => parent.id !== deletedAnimalId
      ),
    },
    userId,
    prevBreeding
  );

export const updateBreedingOnAddedToFolder = (
  prevBreeding: Breeding,
  folderId: string,
  userId: string
) =>
  updateBreeding(
    {
      folderIds: [...prevBreeding.folderIds, folderId],
    },
    userId,
    prevBreeding
  );

export const updateBreedingByRemovingFolder = (
  prevBreeding: Breeding,
  folderId: string,
  userId: string
) =>
  updateBreeding(
    {
      folderIds: prevBreeding.folderIds.filter((id) => id !== folderId),
    },
    userId,
    prevBreeding
  );

export const updateBreedingOnChildAnimalInfoChanged = (
  prevBreeding: Breeding,
  miniAnimal: MiniAnimal,
  userId: string
) =>
  updateBreeding(
    {
      children: prevBreeding.children.map((child) =>
        child.id === miniAnimal.id ? miniAnimal : child
      ),
    },
    userId,
    prevBreeding
  );

export const updateBreedingOnParentAnimalInfoChanged = (
  prevBreeding: Breeding,
  miniAnimal: MiniAnimal,
  userId: string
) =>
  updateBreeding(
    {
      parents: prevBreeding.parents.map((parent) =>
        parent.id === miniAnimal.id ? miniAnimal : parent
      ),
    },
    userId,
    prevBreeding
  );

export const handleUpdateBreedingForm = async (
  data: BreedingFormData,
  userId: string,
  allAnimals: Animal[],
  allBreedings: Breeding[],
  animalsMutator: KeyedMutator<Animal[]>,
  breedingsMutator: KeyedMutator<Breeding[]>,
  prevBreeding: Breeding
) => {
  if (
    isMembersSame(data.parents, prevBreeding.parents) &&
    isMembersSame(data.children, prevBreeding.children) &&
    data.status === prevBreeding.status &&
    data.note === prevBreeding.note &&
    data.startDate === prevBreeding.startDate &&
    data.endDate === prevBreeding.endDate
  ) {
    throw new CustomErr(i18n.t("noChangeDetected"));
  }

  const batch = writeBatch(db);

  const copiedAllAnimals = [...allAnimals];
  const copiedAllBreedings = [...allBreedings];

  // breedingの処理
  const breeding = updateBreeding(data, userId, prevBreeding);
  modifyCopiedDocs("updated", breeding, copiedAllBreedings);
  batch.set(getRef(userId, "breedings", breeding.id), breeding);

  // animalの処理
  const commonFunc = (updatedAnimal: Animal) => {
    modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
  };

  // 新parents
  breeding.parents.forEach((parent) => {
    if (!isMemberIncluded(parent, prevBreeding.parents)) {
      // 新メンバーのみ
      const prevAnimal = getAnimalById(parent.id, allAnimals);
      const updatedAnimal = updateParentAnimalOnAddedToBreeding(
        prevAnimal,
        breeding.id,
        userId
      );
      commonFunc(updatedAnimal);
    }
  });

  // 旧parents
  prevBreeding.parents.forEach((parent) => {
    if (!isMemberIncluded(parent, breeding.parents)) {
      // 除外されたメンバーのみ
      const prevAnimal = getAnimalById(parent.id, allAnimals);
      const updatedAnimal = updateParentAnimalOnLeavingBreeding(
        prevAnimal,
        prevBreeding.id,
        userId
      );
      commonFunc(updatedAnimal);
    }
  });

  // 新children
  breeding.children.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, prevBreeding.children)) {
      // 新メンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      const updatedAnimal = updateChildAnimalOnAddedToBreeding(
        prevAnimal,
        breeding.id,
        userId
      );
      commonFunc(updatedAnimal);
    }
  });

  // 旧children
  prevBreeding.children.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, breeding.children)) {
      // 除外されたメンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      const updatedAnimal = updateChildAnimalOnLeavingBreeding(
        prevAnimal,
        userId
      );
      commonFunc(updatedAnimal);
    }
  });

  await batch.commit();

  mutateDocs(breedingsMutator, copiedAllBreedings);
  mutateDocs(animalsMutator, copiedAllAnimals);
};
