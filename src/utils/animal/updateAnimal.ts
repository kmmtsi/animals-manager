import { writeBatch } from "firebase/firestore";
import { KeyedMutator } from "swr";
import i18n from "../../i18n/config";
import { getBreedingById } from "../breeding/breedingUtils";
import {
  updateBreedingOnChildAnimalInfoChanged,
  updateBreedingOnParentAnimalInfoChanged,
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
} from "../common/definitions";
import { db } from "../firebase";

export const updateAnimal = (
  data: AnimalUpdateData,
  userId: string,
  prevAnimal: Animal
) => {
  const { name, sex, breedingIdAsChild, breedingIdsAsParent, note, folderIds } =
    data;
  const animal: Animal = {
    ...prevAnimal,
    name: name ?? prevAnimal.name,
    sex: sex ?? prevAnimal.sex,
    breedingIdAsChild: breedingIdAsChild ?? prevAnimal.breedingIdAsChild,
    breedingIdsAsParent: breedingIdsAsParent ?? prevAnimal.breedingIdsAsParent,
    note: note ?? prevAnimal.note,
    folderIds: folderIds ?? prevAnimal.folderIds,
    updatedAt: getTimestamp(),
    updatedBy: userId,
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

export const handleUpdateAnimalForm = async (
  data: AnimalFormData,
  userId: string,
  allAnimals: Animal[],
  allBreedings: Breeding[],
  animalsMutator: KeyedMutator<Animal[]>,
  breedingsMutator: KeyedMutator<Breeding[]>,
  prevAnimal: Animal
) => {
  let isNameChanged,
    isSexChanged,
    isNoteChanged = false;

  if (data.name !== prevAnimal.name) isNameChanged = true;
  if (data.sex !== prevAnimal.sex) isSexChanged = true;
  if (data.note !== prevAnimal.note) isNoteChanged = true;

  if (!isNameChanged && !isSexChanged && !isNoteChanged) {
    throw new CustomErr(i18n.t("noChangeDetected"));
  }

  const batch = writeBatch(db);

  // animalを更新
  const animal = updateAnimal(data, userId, prevAnimal);

  batch.set(getRef(userId, "animals", animal.id), animal);

  let copiedAllBreedings: Breeding[] | undefined;

  if (isNameChanged || isSexChanged) {
    // 紐づくbreeding内の自分の情報を更新する
    copiedAllBreedings = [...allBreedings];

    const miniAnimal = { id: animal.id, name: animal.name, sex: animal.sex };

    // breedingIdAsChild
    const prevBrIdAsChild = prevAnimal.breedingIdAsChild;

    if (prevBrIdAsChild !== "") {
      const prevBreeding = getBreedingById(prevBrIdAsChild, allBreedings);

      const newBreeding = updateBreedingOnChildAnimalInfoChanged(
        prevBreeding,
        miniAnimal,
        userId
      );

      batch.set(getRef(userId, "breedings", newBreeding.id), newBreeding);
      modifyCopiedDocs("updated", newBreeding, copiedAllBreedings);
    }

    // breedingIdsAsParent
    animal.breedingIdsAsParent.forEach((brId) => {
      const prevBreeding = getBreedingById(brId, allBreedings);

      const newBreeding = updateBreedingOnParentAnimalInfoChanged(
        prevBreeding,
        miniAnimal,
        userId
      );

      batch.set(getRef(userId, "breedings", newBreeding.id), newBreeding);
      modifyCopiedDocs(
        "updated",
        newBreeding,
        copiedAllBreedings as Breeding[]
      );
    });
  }

  await batch.commit();

  const copiedAllAnimals = [...allAnimals];
  modifyCopiedDocs("updated", animal, copiedAllAnimals);
  mutateDocs(animalsMutator, copiedAllAnimals);

  copiedAllBreedings && mutateDocs(breedingsMutator, copiedAllBreedings);
};
