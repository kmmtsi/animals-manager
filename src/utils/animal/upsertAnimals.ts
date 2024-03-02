import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Sex, Animal, MiniAnimal } from "./definitions";
import { upsertAnimal } from "./upsertAnimal";
import { KeyedMutator } from "swr";
import {
  getAnimalById,
  getWriteResultMsgs,
  mutateAnimals,
  getUpdatedFamily,
  classifyMembers,
} from "./utils";
import { WriteResult } from "./utils";

export const upsertAnimals = async (
  dataToWrite: {
    name: string;
    sex: Sex;
    miniParentAnimals: MiniAnimal[];
    miniChildAnimals: MiniAnimal[];
    note: string;
  },
  userId: string,
  allAnimals: Animal[],
  mutate: KeyedMutator<Animal[]>,
  prevAnimal: Animal | undefined
): Promise<WriteResult> => {
  // batchを初期化
  const batch = writeBatch(db);
  const { name, sex, miniParentAnimals, miniChildAnimals, note } = dataToWrite;

  // createかupdateか判断
  const isCreate = !prevAnimal;

  // 随時更新していくためのallAnimalsのコピーを作成
  const latestAllAnimals = [...allAnimals];

  // 作成または更新された動物一覧の入れ物
  const createdAnimals: Animal[] = [];
  const updatedAnimals: Animal[] = [];

  // miniParentAnimalsを分類
  const {
    addedNewMembers: addedNewParents,
    addedExistingMembers: addedExistingParents,
    removedMembers: removedParents,
  } = classifyMembers(miniParentAnimals, prevAnimal?.parents || []);

  // miniChildAnimalsを分類
  const {
    addedNewMembers: addedNewChildren,
    addedExistingMembers: addedExistingChildren,
    removedMembers: removedChildren,
  } = classifyMembers(miniChildAnimals, prevAnimal?.children || []);

  // addedNewParentsに対してidを付与（★parentsの中の同じ要素も変更される）
  addedNewParents.forEach((parent) => {
    parent.id = doc(collection(db, "users", userId, "animals")).id;
  });

  // addedNewChildrenに対してidを付与（★childrenの中の同じ要素も変更される）
  addedNewChildren.forEach((child) => {
    child.id = doc(collection(db, "users", userId, "animals")).id;
  });

  // mainAnimalに渡すように正式なparentsを作成
  const parents = miniParentAnimals.map((parent) => parent.id);

  // mainAnimalに渡すように正式なchildrenを作成
  const children = miniChildAnimals.map((child) => child.id);

  // mainAnimalを作成または更新
  let mainAnimal: Animal;
  if (isCreate) {
    const id = doc(collection(db, "users", userId, "animals")).id;
    mainAnimal = upsertAnimal(
      {
        id,
        name,
        sex,
        parents,
        children,
        note,
        createdBy: userId,
      },
      userId,
      batch,
      latestAllAnimals
    );
    // createdAnimalsに追加
    createdAnimals.push(mainAnimal);
  } else {
    mainAnimal = upsertAnimal(
      {
        name,
        sex,
        parents: parents,
        children: children,
        note,
        updatedBy: userId,
        prevAnimal,
      },
      userId,
      batch,
      latestAllAnimals
    );
    // updatedAnimalsに追加
    updatedAnimals.push(mainAnimal);
  }

  // parentAnimalsを作成
  addedNewParents.forEach((parent) => {
    createdAnimals.push(
      upsertAnimal(
        {
          ...parent,
          // childrenにmainAnimalを追加
          children: [mainAnimal.id],
          createdBy: userId,
        },
        userId,
        batch,
        latestAllAnimals
      )
    );
  });

  // parentAnimalsを更新
  // (1) childrenにmainAnimalを追加するパターン
  addedExistingParents.forEach((parent) => {
    // parentsに新たに追加された動物のみ更新
    const prevParent = getAnimalById(parent, latestAllAnimals);
    updatedAnimals.push(
      upsertAnimal(
        {
          children: getUpdatedFamily(
            "add",
            [mainAnimal.id],
            prevParent.children
          ),
          updatedBy: userId,
          prevAnimal: prevParent,
        },
        userId,
        batch,
        latestAllAnimals
      )
    );
  });

  // (2) childrenからmainAnimalを除外するパターン
  removedParents.forEach((parent) => {
    // parentsから除外された動物のみ更新
    const prevParent = getAnimalById(parent, latestAllAnimals);
    updatedAnimals.push(
      upsertAnimal(
        {
          children: getUpdatedFamily(
            "remove",
            [mainAnimal.id],
            prevParent.children
          ),
          updatedBy: userId,
          prevAnimal: prevParent,
        },
        userId,
        batch,
        latestAllAnimals
      )
    );
  });

  // childAnimalsを作成
  addedNewChildren.forEach((child) => {
    createdAnimals.push(
      upsertAnimal(
        {
          ...child,
          // parentsにmainAnimalを追加
          parents: [mainAnimal.id],
          createdBy: userId,
        },
        userId,
        batch,
        latestAllAnimals
      )
    );
  });

  // childAnimalsを更新
  // (1) parentsにmainAnimalを追加するパターン
  addedExistingChildren.forEach((child) => {
    // childrenに新たに追加された動物のみ更新
    const prevChild = getAnimalById(child, latestAllAnimals);
    updatedAnimals.push(
      upsertAnimal(
        {
          parents: getUpdatedFamily("add", [mainAnimal.id], prevChild.parents),
          updatedBy: userId,
          prevAnimal: prevChild,
        },
        userId,
        batch,
        latestAllAnimals
      )
    );
  });

  // (2) parentsからmainAnimalを除外するパターン
  removedChildren.forEach((child) => {
    // childrenから除外された動物のみ更新
    const prevChild = getAnimalById(child, latestAllAnimals);
    updatedAnimals.push(
      upsertAnimal(
        {
          parents: getUpdatedFamily(
            "remove",
            [mainAnimal.id],
            prevChild.parents
          ),
          updatedBy: userId,
          prevAnimal: prevChild,
        },
        userId,
        batch,
        latestAllAnimals
      )
    );
  });

  // batchを実行
  await batch.commit();

  // batch処理が成功した場合のみmutate
  mutateAnimals(mutate, latestAllAnimals);

  return {
    status: "success",
    msgs: getWriteResultMsgs({ createdAnimals, updatedAnimals }),
  };
};
