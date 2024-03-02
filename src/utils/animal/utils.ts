import { Animal, MiniAnimal, Sex, sexMapping } from "./definitions";
import { KeyedMutator } from "swr";
import { AnimalValidationErr, formatAnimalValidationErr } from "./validators";
import { FirebaseError } from "firebase/app";

// リストの中からIdを元に動物を探す
export const findAnimalById = <T extends Animal | MiniAnimal>(
  id: string,
  animals: T[]
) => animals.find((animal) => animal.id === id);

/**
 * 動物が見つからない場合エラーを投げる
 * @param id
 * @param animals
 * @returns
 */
export const getAnimalById = <T extends Animal | MiniAnimal>(
  id: string,
  animals: T[]
) => {
  const animal = findAnimalById(id, animals);
  if (animal) {
    return animal;
  } else {
    throw new Error(`id: ${id}をもつ動物が見つかりません`);
  }
};

// リストの中からnameを元に動物を探す
export const findAnimalByName = <T extends Animal | MiniAnimal>(
  name: string,
  animals: T[]
) => animals.find((animal) => animal.name === name);

/**
 * 最新の暫定全動物リストを取得
 * @param currentAllAnimals
 * @param modifiedAnimal
 * @returns
 */
export const modifyLatestAllAnimals = (
  operation: "created" | "updated" | "deleted",
  animal: Animal,
  latestAllAnimals: Animal[]
) => {
  switch (operation) {
    case "created":
      latestAllAnimals.push(animal);
      break;
    case "updated":
      {
        const index = latestAllAnimals.findIndex(
          (latestAnimal) => latestAnimal.id === animal.id
        );
        latestAllAnimals[index] = animal;
      }
      break;
    case "deleted":
      {
        const index = latestAllAnimals.findIndex(
          (latestAnimal) => latestAnimal.id === animal.id
        );
        latestAllAnimals.splice(index, 1);
      }
      break;
  }
};

// 書き込み完了後にanimalsを更新
export const mutateAnimals = (
  mutate: KeyedMutator<Animal[]>,
  latestAllAnimals: Animal[]
) => {
  mutate(latestAllAnimals, {
    revalidate: false, // 再検証を行わない
  });
};

export const getWriteResultMsgs = (modifiedAnimals: {
  createdAnimals?: Animal[];
  updatedAnimals?: Animal[];
  deletedAnimals?: Animal[];
}) => {
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
    // 表示順はcreate -> delete -> update
    ...(msgsForCreatedAnimals || []),
    ...(msgsForDeletedAnimals || []),
    ...(msgsForUpdatedAnimals || []),
  ];
};

// update用に必要に応じて既存のfamilyとマージなどさせる
export const getUpdatedFamily = (
  operation: "add" | "remove",
  members: string[],
  prevFamily: string[]
) => {
  if (operation === "add") {
    return [...prevFamily, ...members];
  } else {
    return prevFamily.filter((prevMember) => !members.includes(prevMember));
  }
};

// 変更されたmemberを取得
export type ClassifiedMembers = {
  unchangedMembers: string[]; // 変更されていない動物
  addedNewMembers: MiniAnimal[]; // 新規動物
  addedExistingMembers: string[]; // 新たに追加された既存動物
  removedMembers: string[]; // 新たに除外された動物
};
/**
 * Familyのメンバーを4種類に分類
 * @param currentMiniFamily
 * @param prevFamily
 * @param animals
 * @returns
 */
export const classifyMembers = (
  currentMiniFamily: MiniAnimal[],
  prevFamily: string[]
) => {
  const classifiedMembers: ClassifiedMembers = {
    unchangedMembers: [],
    addedNewMembers: [],
    addedExistingMembers: [],
    removedMembers: [],
  };

  currentMiniFamily.forEach((currentMember) => {
    if (currentMember.id === "") {
      // 新規動物
      classifiedMembers.addedNewMembers.push(currentMember);
    } else {
      // 新規動物以外
      if (prevFamily.includes(currentMember.id)) {
        // 以前からメンバーとして存在している
        classifiedMembers.unchangedMembers.push(currentMember.id);
      } else {
        // 以前のメンバーとして存在していない
        // 新たに追加された既存動物
        classifiedMembers.addedExistingMembers.push(currentMember.id);
      }
    }
  });
  prevFamily.forEach((prevMember) => {
    if (!findAnimalById(prevMember, currentMiniFamily)) {
      // 新たなfamilyに含まれていない -> 除外された
      classifiedMembers.removedMembers.push(prevMember);
    }
  });
  return classifiedMembers;
};

// nameが変更されたか
export const isNameChanged = (name: string, prevName: string) =>
  name !== prevName;

// sexが変更されたか
export const isSexChanged = (sex: Sex, prevSex: Sex) => sex !== prevSex;

// familyが変更されたか
export const isFamilyChanged = (family: string[], prevFamily: string[]) => {
  let changed = false;

  // メンバー数が変わっていたら変更あり
  if (family.length !== prevFamily.length) return true;

  family.some((member) => {
    if (member === "") {
      // 新規メンバーが追加された
      changed = true;
      return true; // ループ終了
    } else {
      if (!prevFamily.find((prevMember) => prevMember === member)) {
        // 既存メンバーが追加された
        changed = true;
        return true; // ループ終了
      }
    }
  });

  // 既存メンバーが除外されたパターンは、新旧メンバー数が違えばlengthの比較で検知されるし、同じであれば、メンバーを足したことになるので上記の処理で検知される

  return changed;
};

// メモが変更されたか
export const isNoteChanged = (note: string, prevNote: string) =>
  note !== prevNote;

// 変更されたフィールドを取得
export const getChangedFields = (
  name: string,
  sex: Sex,
  parents: string[],
  children: string[],
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
  if (isFamilyChanged(parents, prevAnimal.parents)) {
    changedFields.push("parents");
  }
  // children
  if (isFamilyChanged(children, prevAnimal.children)) {
    changedFields.push("children");
  }
  if (isNoteChanged(note, prevAnimal.note)) {
    changedFields.push("note");
  }
  return changedFields;
};

/**
 * Sexの値を変換
 * @param sex
 * @returns
 */
export const formatSex = (sex: string): Sex => sexMapping[sex] || "";

/**
 * animalをMiniAnimalに変換
 * @param animal
 * @returns
 */
export const convertAnimalToMini = (animal: Animal): MiniAnimal => ({
  id: animal.id,
  name: animal.name,
  sex: animal.sex,
});

/**
 * animalsをMiniAnimalsに変換
 * @param animals
 * @returns
 */
export const convertAnimalsToMinis = (animals: Animal[]): MiniAnimal[] =>
  animals.map((animal) => convertAnimalToMini(animal));

/**
 * familyが選択可能な数に達しているかどうか
 * @param family
 * @param maxSelect
 * @returns
 */
export const isFamilyFull = (familyLength: number, maxSelect: number) => {
  return familyLength >= maxSelect;
};

/**
 * 呼ばれるべきタイミング
 * - Dialogが開かれているときのうち、
 * - inputに入力があった時
 * - familyが追加または削除された時
 * @param inputText
 * @param usedAnimals
 * @param allAnimals
 */
export const getAnimalsToSuggest = (
  inputText: string,
  miniAnimalsInUse: MiniAnimal[],
  allMiniAnimals: MiniAnimal[]
) => {
  // 全ての既存の動物のうち、現在使用されていない動物のみを選別
  // mainAnimalが新規の時は適切なidを持たないが、そもそもallMiniAnimalsに含まれていないので問題ない
  const suggestableAnimals = allMiniAnimals.filter((candidate) => {
    const isCandidateInUse = miniAnimalsInUse.some(
      (miniAnimalInUse) => miniAnimalInUse.id === candidate.id
    );
    return !isCandidateInUse;
  });

  // inputの正規表現で選別
  const regex = new RegExp(inputText, "i");
  return suggestableAnimals.filter((animal) => animal.name.match(regex));
};

// 日付の処理
// https://qiita.com/__knm__/items/3c7466a19abdf5192d11
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
// https://developer.mozilla.org/ja/docs/Web/HTML/Element/time

/**
 * 現在時刻のタイムスタンプを取得
 * @returns
 */
export const getTimestamp = () => new Date().toISOString();

// Dateオブジェクトに変換
const getDateObj = (timestamp: string) => new Date(timestamp);

/**
 * timestamp -> サイト表示用データ
 * @param timestamp
 * @returns
 */
export const getLocalDateString = (timestamp: string) => {
  const dateObj = getDateObj(timestamp);
  return dateObj.toLocaleDateString();
};

/**
 * DBへの書き込み結果やバリデーション結果の型
 */
export type WriteResult = { status: "success" | "err"; msgs: string[] };

/**
 * DB書き込み時のエラーメッセージを取得
 * @param err
 * @returns
 */
export const getWriteErrMsgs = (err: unknown) => {
  // 開発環境時にはエラーをコンソールに出力
  if (import.meta.env.DEV) console.error(err);

  if (err instanceof AnimalValidationErr) {
    // AnimalValidationErrからフォーマットされたメッセージを抽出
    return formatAnimalValidationErr(err);
  } else if (err instanceof FirebaseError) {
    return ["データベースへの書き込みでエラーが発生しました"];
  } else {
    return ["不明なエラーが発生しました"];
  }
};
