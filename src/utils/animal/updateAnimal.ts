import { writeBatch } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { KeyedMutator } from "swr";
import i18n from "../../i18n/config";
import {
  updateBreedingOnChildAnimalInfoChanged,
  updateBreedingsOnParentAnimalInfoChanged,
} from "../breeding/updateBreeding";
import {
  CustomErr,
  getRef,
  getTimestamp,
  modifyCopiedDocs,
  mutateDocs,
} from "../common/commonUtils";
import {
  Animal,
  AnimalFormData,
  AnimalUpdateData,
  Breeding,
  MiniAnimal,
} from "../common/definitions";
import { db } from "../firebase";

export const updateAnimal = (
  data: AnimalUpdateData,
  userId: string,
  prevAnimal: Animal
) => {
  const {
    name,
    sex,
    breedingIdAsChild,
    breedingIdsAsParent,
    note,
    dateOfBirth,
    healthCondition,
    folderIds,
  } = data;
  const animal: Animal = {
    name: name ?? prevAnimal.name,
    sex: sex ?? prevAnimal.sex,
    breedingIdAsChild: breedingIdAsChild ?? prevAnimal.breedingIdAsChild,
    breedingIdsAsParent: breedingIdsAsParent ?? prevAnimal.breedingIdsAsParent,
    note: note ?? prevAnimal.note,
    dateOfBirth: dateOfBirth ?? prevAnimal.dateOfBirth,
    healthCondition: healthCondition ?? prevAnimal.healthCondition,
    folderIds: folderIds ?? prevAnimal.folderIds,
    updatedAt: getTimestamp(),
    updatedBy: userId,
    // 以下変更なし
    id: prevAnimal.id,
    createdAt: prevAnimal.createdAt,
    createdBy: prevAnimal.createdBy,
  };
  return animal;
};

export const updateAnimalOnAddedToFolder = (
  prevAnimal: Animal,
  folderId: string,
  userId: string
) =>
  updateAnimal(
    {
      folderIds: [...prevAnimal.folderIds, folderId],
    },
    userId,
    prevAnimal
  );

export const updateAnimalOnLeavingFolder = (
  prevAnimal: Animal,
  folderId: string,
  userId: string
) =>
  updateAnimal(
    {
      folderIds: prevAnimal.folderIds.filter((id) => id !== folderId),
    },
    userId,
    prevAnimal
  );

export const updateParentAnimalOnAddedToBreeding = (
  prevAnimal: Animal,
  breedingId: string,
  userId: string
) =>
  updateAnimal(
    {
      breedingIdsAsParent: [...prevAnimal.breedingIdsAsParent, breedingId],
    },
    userId,
    prevAnimal
  );

export const updateChildAnimalOnAddedToBreeding = (
  prevAnimal: Animal,
  breedingId: string,
  userId: string
) =>
  updateAnimal(
    {
      breedingIdAsChild: breedingId,
    },
    userId,
    prevAnimal
  );

export const updateParentAnimalOnLeavingBreeding = (
  prevAnimal: Animal,
  breedingId: string,
  userId: string
) =>
  updateAnimal(
    {
      breedingIdsAsParent: prevAnimal.breedingIdsAsParent.filter(
        (id) => id !== breedingId
      ),
    },
    userId,
    prevAnimal
  );

export const updateChildAnimalOnLeavingBreeding = (
  prevAnimal: Animal,
  userId: string
) =>
  updateAnimal(
    {
      breedingIdAsChild: "",
    },
    userId,
    prevAnimal
  );

const checkIfFieldsChanged = (data: AnimalFormData, prevAnimal: Animal) => {
  let isNameChanged,
    isSexChanged,
    isNoteChanged,
    isHealthConditionChanged,
    isDateOfBirthChanged = false;

  if (data.name !== prevAnimal.name) isNameChanged = true;
  if (data.sex !== prevAnimal.sex) isSexChanged = true;
  if (data.note !== prevAnimal.note) isNoteChanged = true;
  if (data.healthCondition !== prevAnimal.healthCondition)
    isHealthConditionChanged = true;
  if (data.dateOfBirth !== prevAnimal.dateOfBirth) isDateOfBirthChanged = true;

  if (
    !isNameChanged &&
    !isSexChanged &&
    !isNoteChanged &&
    !isHealthConditionChanged &&
    !isDateOfBirthChanged
  ) {
    throw new CustomErr(i18n.t("noChangeDetected"));
  }

  return { isNameChanged, isSexChanged };
};

export const handleUpdateAnimalForm = async (
  data: AnimalFormData,
  userId: string,
  allAnimals: Animal[],
  allBreedings: Breeding[],
  prevAnimal: Animal,
  options: {
    mutators?: {
      animalsMutator: KeyedMutator<Animal[]>;
      breedingsMutator: KeyedMutator<Breeding[]>;
    };
    setters?: {
      setCurrentAnimal: Dispatch<SetStateAction<Animal>>;
      setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
      setAllBreedings: Dispatch<SetStateAction<Breeding[]>>;
    };
  }
) => {
  /* フィールドを追加する毎に必ず更新 */
  const { isNameChanged, isSexChanged } = checkIfFieldsChanged(
    data,
    prevAnimal
  );

  const mutators = options.mutators;
  const setters = options.setters;

  // mutatorsがあるときのみDBの処理を行う
  const batch = mutators && writeBatch(db);

  // animalを更新
  const updatedAnimal = updateAnimal(data, userId, prevAnimal);

  let updatedBreedings: Breeding[] | undefined;

  if (isNameChanged || isSexChanged) {
    // 紐づくbreeding内の自分の情報を更新する
    updatedBreedings = [];

    const miniAnimal: MiniAnimal = {
      id: updatedAnimal.id,
      name: updatedAnimal.name,
      sex: updatedAnimal.sex,
    };

    // breedingIdAsChild
    const updatedBreedingAsChild = updateBreedingOnChildAnimalInfoChanged(
      updatedAnimal.breedingIdAsChild,
      miniAnimal,
      allBreedings,
      userId
    );

    updatedBreedingAsChild && updatedBreedings.push(updatedBreedingAsChild);

    // breedingIdsAsParent
    const updatedBreedingsAsParent = updateBreedingsOnParentAnimalInfoChanged(
      updatedAnimal.breedingIdsAsParent,
      miniAnimal,
      allBreedings,
      userId
    );

    updatedBreedings = [...updatedBreedings, ...updatedBreedingsAsParent];
  }

  if (batch) {
    // animalのバッチをセット
    batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);

    // breedingsのバッチをセット
    updatedBreedings &&
      updatedBreedings.forEach((breeding) =>
        batch.set(getRef(userId, "breedings", breeding.id), breeding)
      );

    await batch.commit();
  }

  // animalをmutate
  const copiedAllAnimals = [...allAnimals];
  modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);

  mutators && mutateDocs(mutators.animalsMutator, copiedAllAnimals);
  if (setters) {
    setters.setCurrentAnimal(updatedAnimal);
    setters.setAllAnimals(copiedAllAnimals);
  }

  // breedingsをmutate
  if (updatedBreedings) {
    const copiedAllBreedings = [...allBreedings];
    updatedBreedings.forEach((breeding) => {
      modifyCopiedDocs("updated", breeding, copiedAllBreedings);
    });

    mutators && mutateDocs(mutators.breedingsMutator, copiedAllBreedings);
    setters && setters.setAllBreedings(copiedAllBreedings);
  }
};
