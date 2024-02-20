import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";
import { Sex, Animal, BaseAnimal } from "../definitions";
import { createAnimal } from "./createAnimal";
import { updateAnimal } from "./updateAnimal";
import { KeyedMutator } from "swr";
import {
  getAnimalById,
  ChangedFamily,
  getWriteResultMsgs,
  mutateAnimals,
} from "../utils";

export type WriteResult = { status: "success" | "err"; msgs: string[] };

type WriteAnimals = (
  dataToWrite: {
    name: string;
    sex: Sex;
    parents: {
      currentParents: BaseAnimal[];
      changedParents: ChangedFamily;
    };
    children: {
      currentChildren: BaseAnimal[];
      changedChildren: ChangedFamily;
    };
    note: string;
  },
  user: User,
  animals: Animal[],
  mutate: KeyedMutator<Animal[]>,
  prevAnimal: Animal,
  isCreate: boolean
) => Promise<WriteResult>;

export const writeAnimals: WriteAnimals = async (
  dataToWrite,
  user,
  animals,
  mutate,
  prevAnimal,
  isCreate
) => {
  // batchを初期化
  const batch = writeBatch(db);

  const { name, sex, parents, children, note } = dataToWrite;
  const {
    addedNewMembers: addedNewParents,
    addedExistingMembers: addedExistingParents,
    removedMembers: removedParents,
  } = parents.changedParents;

  const {
    addedNewMembers: addedNewChildren,
    addedExistingMembers: addedExistingChildren,
    removedMembers: removedChildren,
  } = children.changedChildren;

  // mainAnimalを作成または更新
  const mainAnimal = isCreate
    ? // mainAnimalを作成
      createAnimal(
        {
          id: doc(collection(db, "users", user.uid, "animals")).id,
          name,
          sex,
          parents: parents.currentParents,
          children: children.currentChildren,
          note,
        },
        user,
        batch
      )
    : // mainAnimalを更新
      updateAnimal(
        {
          // formから渡ってきた情報は全て渡す
          name,
          sex,
          parents: {
            operation: "replace",
            data: parents.currentParents,
          },
          children: {
            operation: "replace",
            data: children.currentChildren,
          },
          note,
        },
        user,
        batch,
        prevAnimal
      );

  const baseMainAnimal = {
    id: mainAnimal.id,
    name: mainAnimal.name,
    sex: mainAnimal.sex,
  };

  // parentsを作成
  const createdParents = addedNewParents.map((parent) => {
    return createAnimal(
      {
        ...parent,
        // childrenにmainAnimalを追加
        children: [baseMainAnimal],
      },
      user,
      batch
    );
  });

  // parentsを更新
  const updatedParents: Animal[] = [];

  // (1) childrenにmainAnimalを追加するパターン
  addedExistingParents.forEach((parent) => {
    // parentsに新たに追加された動物のみ更新
    const updatedAnimal = updateAnimal(
      {
        children: {
          operation: "add",
          data: [baseMainAnimal],
        },
      },
      user,
      batch,
      getAnimalById(parent.id, animals) as Animal
    );
    updatedParents.push(updatedAnimal);
  });

  // (2) childrenからmainAnimalを除外するパターン
  removedParents.forEach((parent) => {
    // parentsから除外された動物のみ更新
    const updatedAnimal = updateAnimal(
      {
        children: {
          operation: "remove",
          data: [baseMainAnimal],
        },
      },
      user,
      batch,
      getAnimalById(parent.id, animals) as Animal
    );
    updatedParents.push(updatedAnimal);
  });

  // childrenを作成
  const createdChildren = addedNewChildren.map((child) => {
    return createAnimal(
      {
        ...child,
        // parentsにmainAnimalを追加
        parents: [baseMainAnimal],
      },
      user,
      batch
    );
  });

  // childrenを更新
  const updatedChildren: Animal[] = [];

  // (1) parentsにmainAnimalを追加するパターン
  addedExistingChildren.forEach((child) => {
    // childrenに新たに追加された動物のみ更新
    const updatedAnimal = updateAnimal(
      {
        parents: {
          operation: "add",
          data: [baseMainAnimal],
        },
      },
      user,
      batch,
      getAnimalById(child.id, animals) as Animal
    );
    updatedChildren.push(updatedAnimal);
  });

  // (2) parentsからmainAnimalを除外するパターン
  removedChildren.forEach((child) => {
    // childrenから除外された動物のみ更新
    const updatedAnimal = updateAnimal(
      {
        parents: {
          operation: "remove",
          data: [baseMainAnimal],
        },
      },
      user,
      batch,
      getAnimalById(child.id, animals) as Animal
    );
    updatedChildren.push(updatedAnimal);
  });

  try {
    // batchを実行
    await batch.commit();

    // 作成された動物一覧
    const createdAnimals = [...createdParents, ...createdChildren];

    // 更新された動物一覧
    const updatedAnimals = [...updatedParents, ...updatedChildren];

    // mainAnimalをどちらかの動物一覧に追加
    isCreate
      ? createdAnimals.push(mainAnimal)
      : updatedAnimals.push(mainAnimal);

    // batch処理が成功した場合のみmutate
    mutateAnimals(mutate, animals, { createdAnimals, updatedAnimals });

    return {
      status: "success",
      msgs: getWriteResultMsgs({ createdAnimals, updatedAnimals }),
    };
  } catch (err) {
    return { status: "err", msgs: getWriteResultMsgs() };
  }
};
