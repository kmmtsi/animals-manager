import { Animal, BaseAnimal, Sex } from "./definitions";
import { KeyedMutator } from "swr";
import { OperationToFamily } from "./write/updateAnimal";

// リストの中からIdを元に動物を探す
export const getAnimalById = <T extends Animal | BaseAnimal>(
  id: string,
  animals: T[]
) => {
  // 何も見つからない場合undefinedを返す
  return animals.find((animal) => animal.id === id);
};

// リストの中からnameを元に動物を探す
export const getAnimalByName = (
  name: string,
  animals: Animal[] | BaseAnimal[]
) => {
  // 何も見つからない場合undefinedを返す
  return animals.find((animal) => animal.name === name);
};

// 追加されたfamily memberが新規か既存かを判定
export const isNewAnimal = (
  animal: Animal | BaseAnimal,
  animals: Animal[] | BaseAnimal[]
) => {
  return getAnimalById(animal.id, animals) ? false : true;
};

// animalsからbaseAnimalsを作成
export const getBaseAnimals = (animals: Animal[]): BaseAnimal[] =>
  animals.map((animal) => ({
    id: animal.id,
    name: animal.name,
    sex: animal.sex,
  }));

// 書き込み完了後にanimalsを更新
export const mutateAnimals = (
  mutate: KeyedMutator<Animal[]>,
  animals: Animal[],
  modifiedAnimals: {
    createdAnimals?: Animal[];
    updatedAnimals?: Animal[];
    deletedAnimals?: Animal[];
  }
) => {
  const { createdAnimals, updatedAnimals, deletedAnimals } = modifiedAnimals;
  // createされたanimalは既存のanimalsに追加
  const newAnimals = [...animals, ...(createdAnimals || [])];

  // updateされたanimalは既存のanimalと置き換える
  updatedAnimals?.forEach((updated) => {
    const index = newAnimals.findIndex((animal) => animal.id === updated.id);
    newAnimals[index] = updated;
  });

  // deleteされたanimalは削除
  deletedAnimals?.forEach((deleted) => {
    const index = newAnimals.findIndex((animal) => animal.id === deleted.id);
    // newAnimals[index]から1つ分削除
    newAnimals.splice(index, 1);
  });

  mutate(newAnimals, {
    revalidate: false, // 再検証を行わない
  });
};

export const getWriteResultMsgs = (modifiedAnimals?: {
  createdAnimals?: Animal[];
  updatedAnimals?: Animal[];
  deletedAnimals?: Animal[];
}) => {
  if (modifiedAnimals) {
    // 引数あり
    const { createdAnimals, updatedAnimals, deletedAnimals } = modifiedAnimals;

    // create
    const msgsForCreatedAnimals = createdAnimals?.map(
      (animal) => `${animal.name}をリストに追加しました`
    );

    // update
    const msgsForUpdatedAnimals = updatedAnimals?.map(
      (animal) => `${animal.name}の情報を更新しました`
    );

    // delete
    const msgsForDeletedAnimals = deletedAnimals?.map(
      (animal) => `${animal.name}を削除しました`
    );

    return [
      ...(msgsForCreatedAnimals || []),
      ...(msgsForUpdatedAnimals || []),
      ...(msgsForDeletedAnimals || []),
    ];
  } else {
    // 引数なしでエラー時のメッセージを出力
    return ["データベースへの書き込みに失敗しました"];
  }
};

// update用に必要に応じて既存のfamilyとマージなどさせる
export const getUpdatedFamily = (
  operation: OperationToFamily,
  members: BaseAnimal[],
  prevFamily: BaseAnimal[]
) => {
  if (operation === "replace") {
    return members;
  } else if (operation === "add") {
    return [...prevFamily, ...members];
  } else {
    return prevFamily.filter(
      (prevMember) =>
        // 除外依頼があった「members」の中にidがあればfalse（trueの逆）を返す
        // filterはtrueを返した要素だけを残すので、除外依頼があった「member」はフィルタリングされ、結果には残らない
        !members.some((member) => member.id === prevMember.id)
    );
  }
};

// nameが変更されたか
export const isNameChanged = (name: string, prevName: string) =>
  name !== prevName;

// sexが変更されたか
export const isSexChanged = (sex: Sex, prevSex: Sex) => sex !== prevSex;

// 変更されたmemberを取得
export type ChangedFamily = {
  addedNewMembers: BaseAnimal[];
  addedExistingMembers: BaseAnimal[];
  removedMembers: BaseAnimal[];
};
export const getChangedFamily = (
  currentFamily: BaseAnimal[],
  prevFamily: BaseAnimal[],
  animals: BaseAnimal[]
): ChangedFamily => {
  const addedNewMembers: BaseAnimal[] = []; // 新規動物
  const addedExistingMembers: BaseAnimal[] = []; // 新たに追加された既存動物
  const removedMembers: BaseAnimal[] = []; // 新たに除外された動物

  currentFamily.forEach((member) => {
    if (isNewAnimal(member, animals)) {
      // idが空文字列 -> 新規動物
      addedNewMembers.push(member);
    } else {
      // 新規動物以外
      if (!getAnimalById(member.id, prevFamily)) {
        // 新たに追加された既存動物
        addedExistingMembers.push(member);
      }
    }
  });
  prevFamily.forEach((member) => {
    if (!getAnimalByName(member.name, currentFamily)) {
      // 新たなfamilyに含まれていない -> 除外された
      removedMembers.push(member);
    }
  });
  return { addedNewMembers, addedExistingMembers, removedMembers };
};

// メモが変更されたか
export const isNoteChanged = (note: string, prevNote: string) =>
  note !== prevNote;

// 変更されたフィールドを取得
export const getChangedFields = (
  name: string,
  sex: Sex,
  changedParents: ChangedFamily,
  changedChildren: ChangedFamily,
  note: string,
  prevAnimal: Animal
) => {
  const changedFields = [];

  if (isNameChanged(name, prevAnimal.name)) {
    changedFields.push("name");
  }
  if (isSexChanged(sex, prevAnimal.sex)) {
    changedFields.push("sex");
  }
  // parents
  if (
    changedParents.addedNewMembers.length > 0 ||
    changedParents.addedExistingMembers.length > 0 ||
    changedParents.removedMembers.length > 0
  ) {
    changedFields.push("parents");
  }
  // children
  if (
    changedChildren.addedNewMembers.length > 0 ||
    changedChildren.addedExistingMembers.length > 0 ||
    changedChildren.removedMembers.length > 0
  ) {
    changedFields.push("children");
  }
  if (isNoteChanged(note, prevAnimal.note)) {
    changedFields.push("note");
  }
  return changedFields;
};
