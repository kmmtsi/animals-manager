import { writeBatch } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
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

export const updateBreedingOnChildAnimalInfoChanged = (
  breedingIdAsChild: string,
  miniAnimal: MiniAnimal,
  allBreedings: Breeding[],
  userId: string
) => {
  if (breedingIdAsChild === "") {
    return null;
  } else {
    const prevBreeding = allBreedings.find(
      (breeding) => breeding.id === breedingIdAsChild
    ) as Breeding;

    return updateBreeding(
      {
        children: prevBreeding.children.map((child) =>
          child.id === miniAnimal.id ? miniAnimal : child
        ),
      },
      userId,
      prevBreeding
    );
  }
};

export const updateBreedingsOnParentAnimalInfoChanged = (
  breedingIdsAsParent: string[],
  miniAnimal: MiniAnimal,
  allBreedings: Breeding[],
  userId: string
) => {
  return breedingIdsAsParent.map((breedingId) => {
    const prevBreeding = allBreedings.find(
      (breeding) => breeding.id === breedingId
    ) as Breeding;

    return updateBreeding(
      {
        parents: prevBreeding.parents.map((parent) =>
          parent.id === miniAnimal.id ? miniAnimal : parent
        ),
      },
      userId,
      prevBreeding
    );
  });
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

export const updateBreedingOnLeavingFolder = (
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

const checkIfFieldsChanged = (
  data: BreedingFormData,
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
};

export const handleUpdateBreedingForm = async (
  data: BreedingFormData,
  userId: string,
  allAnimals: Animal[],
  allBreedings: Breeding[],
  prevBreeding: Breeding,
  options: {
    mutators?: {
      animalsMutator: KeyedMutator<Animal[]>;
      breedingsMutator: KeyedMutator<Breeding[]>;
    };
    setters?: {
      setAllBreedings: Dispatch<SetStateAction<Breeding[]>>;
      setAllAnimals: Dispatch<SetStateAction<Animal[]>>;
      setCurrentBreeding: Dispatch<SetStateAction<Breeding>>;
    };
  }
) => {
  /* フィールドを追加する毎に必ず更新 */
  checkIfFieldsChanged(data, prevBreeding);

  const mutators = options.mutators;
  const setters = options.setters;

  const batch = mutators && writeBatch(db);

  // breedingの処理
  const updatedBreeding = updateBreeding(data, userId, prevBreeding);

  // animalの処理
  const updatedAnimals: Animal[] = [];

  // 新parents
  updatedBreeding.parents.forEach((parent) => {
    if (!isMemberIncluded(parent, prevBreeding.parents)) {
      // 新メンバーのみ
      const prevAnimal = allAnimals.find(
        (animal) => animal.id === parent.id
      ) as Animal;
      updatedAnimals.push(
        updateParentAnimalOnAddedToBreeding(
          prevAnimal,
          updatedBreeding.id,
          userId
        )
      );
    }
  });

  // 旧parents
  prevBreeding.parents.forEach((parent) => {
    if (!isMemberIncluded(parent, updatedBreeding.parents)) {
      // 除外されたメンバーのみ
      const prevAnimal = getAnimalById(parent.id, allAnimals);
      updatedAnimals.push(
        updateParentAnimalOnLeavingBreeding(prevAnimal, prevBreeding.id, userId)
      );
    }
  });

  // 新children
  updatedBreeding.children.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, prevBreeding.children)) {
      // 新メンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      updatedAnimals.push(
        updateChildAnimalOnAddedToBreeding(
          prevAnimal,
          updatedBreeding.id,
          userId
        )
      );
    }
  });

  // 旧children
  prevBreeding.children.forEach((miniAnimal) => {
    if (!isMemberIncluded(miniAnimal, updatedBreeding.children)) {
      // 除外されたメンバーのみ
      const prevAnimal = getAnimalById(miniAnimal.id, allAnimals);
      updatedAnimals.push(
        updateChildAnimalOnLeavingBreeding(prevAnimal, userId)
      );
    }
  });

  if (batch) {
    // breedingのバッチをセット
    batch.set(getRef(userId, "breedings", updatedBreeding.id), updatedBreeding);

    // animalsのバッチをセット
    updatedAnimals.forEach((updatedAnimal) => {
      batch.set(getRef(userId, "animals", updatedAnimal.id), updatedAnimal);
    });
    await batch.commit();
  }

  // breedingをmutate
  const copiedAllBreedings = [...allBreedings];
  modifyCopiedDocs("updated", updatedBreeding, copiedAllBreedings);

  if (mutators) {
    mutateDocs(mutators.breedingsMutator, copiedAllBreedings);
  }
  if (setters) {
    setters.setAllBreedings(copiedAllBreedings);
    setters.setCurrentBreeding(updatedBreeding);
  }

  // animalをmutate
  if (updatedAnimals.length > 0) {
    const copiedAllAnimals = [...allAnimals];
    updatedAnimals.forEach((updatedAnimal) => {
      modifyCopiedDocs("updated", updatedAnimal, copiedAllAnimals);
    });

    if (mutators) {
      mutateDocs(mutators.animalsMutator, copiedAllAnimals);
    }
    if (setters) {
      setters.setAllAnimals(copiedAllAnimals);
    }
  }
};
