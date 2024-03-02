import {
  Animal,
  MiniAnimal,
  minAnimalName,
  maxAnimalName,
  Sex,
  sexValues,
  maxNote,
  maxParents,
  maxChildren,
  familyMapping,
  AnimalKey,
} from "./definitions";
import { findAnimalById, findAnimalByName } from "./utils";

// validate: form送信時など用。inspectも兼ねる場合も多い。
// inspect: 既に作成済みのDB用
// ユーザー入力の無い項目のエラーに関してはコーディングミスによるものであり、開発時に気付けるはずなのでvalidateは行わない

// multiple: 複数のフィールドをまたがるバリデーション
type ValidatedAnimalField = AnimalKey | "multiple";

export class AnimalFieldValidationErr extends Error {
  field: ValidatedAnimalField;
  msgs;
  constructor(field: ValidatedAnimalField, msgs: string[]) {
    super();
    this.name = "AnimalFieldValidationErr";
    this.field = field;
    this.msgs = msgs;
  }
}

// AnimalFieldValidationErrをまとめる
export class AnimalValidationErr extends Error {
  animalName: string;
  animalFieldValidationErrs: AnimalFieldValidationErr[];
  constructor(
    animalName: string,
    animalFieldValidationErrs: AnimalFieldValidationErr[]
  ) {
    super();
    this.name = "AnimalValidationErr";
    this.animalName = animalName;
    this.animalFieldValidationErrs = animalFieldValidationErrs;
  }
}

/**
 * AnimalValidationErrをUI用にフォーマット
 * @param animalValidationErr
 * @returns
 */
export const formatAnimalValidationErr = (
  animalValidationErr: AnimalValidationErr
) => {
  // 動物名
  const animalName = animalValidationErr.animalName;
  // エラーメッセージをループ処理
  return animalValidationErr.animalFieldValidationErrs.flatMap(
    (animalFieldValidationErr) => {
      const fieldName = animalFieldValidationErr.field;
      return animalFieldValidationErr.msgs.map((msg) => {
        // 最小単位であるfieldのエラーメッセージに対して、動物名とフィールド名をつける
        return `${animalName} > ${fieldName} > ${msg}`;
      });
    }
  );
};

// AnimalValidationErrをまとめる
export class AnimalsValidationErr extends Error {
  animalValidationErrs: AnimalValidationErr[];
  constructor(animalValidationErrs: AnimalValidationErr[]) {
    super("データベース内に不正なデータが存在します");
    this.name = "AnimalsValidationErr";
    this.animalValidationErrs = animalValidationErrs;
  }
}

/**
 * ひとつのフィールドに対する複数のバリデーターをエラーをthrowせずに実行する
 * 一つ以上のエラーがある場合はエラーをthrowする
 * @param validators
 */
const executeMultipleValidatorsForAField = (
  field: ValidatedAnimalField,
  validators: (() => void)[]
) => {
  const errMsgs: string[] = [];
  validators.forEach((validator) => {
    try {
      validator();
    } catch (err) {
      if (err instanceof AnimalFieldValidationErr) {
        errMsgs.push(...err.msgs);
      }
    }
  });
  if (errMsgs.length) {
    throw new AnimalFieldValidationErr(field, errMsgs);
  }
};

/**
 * Idのインスペクション
 * @param id
 * @param docId
 * @returns
 */
const inspectId = (id: string, docId: string) => {
  if (id !== docId) {
    throw new AnimalFieldValidationErr("id", ["idとdocumentIdが一致しません"]);
  }
};

/**
 * name
 */

/**
 * nameの文字数チェック
 * @param name
 * @returns 失敗時はValidationErrをthrow
 */
const validateNameLength = (name: string) => {
  if (name.length < minAnimalName || name.length > maxAnimalName) {
    throw new AnimalFieldValidationErr("name", [
      `${minAnimalName}文字以上${maxAnimalName}文字以内で入力してください`,
    ]);
  }
};

/**
 * 全てのanimalsの中に同じ名前の動物がいないかチェック
 * @param name
 * @param animals
 * @returns
 */
const validateNameUniqueness = (
  name: string,
  allAnimals: Animal[] | MiniAnimal[]
) => {
  if (findAnimalByName(name, allAnimals)) {
    throw new AnimalFieldValidationErr("name", [
      "同じ名前が既に使用されています",
    ]);
  }
};

/**
 * 全てのanimalsの中に同じ名前の動物が1度も登場しないか複数回登場していないかチェック。validateNameUniquenessとは違い1度は登場すべきである
 * @param name
 * @param allAnimals
 */
const inspectNameUniqueness = (
  name: string,
  allAnimals: Animal[] | MiniAnimal[]
) => {
  if (allAnimals.filter((animal) => animal.name === name).length !== 1) {
    throw new AnimalFieldValidationErr("name", [
      "リストの中に同じ名前が1度も登場しないか複数回登場しています",
    ]);
  }
};

/**
 * 名前に特定のNG文字が含まれていないかチェック
 * @param name
 * @returns
 */
const validateNamePattern = (name: string) => {
  const ngChars = ",;";
  // []: この中身が1文字を表す
  const regex = new RegExp(`[${ngChars}]`, "g");
  if (regex.test(name)) {
    throw new AnimalFieldValidationErr("name", [
      `名前に「${ngChars}」を含めることはできません`,
    ]);
  }
};

/**
 * nameのバリデーション
 * 内部で下記のバリデーションを実行
 * - `validateNameLength`
 * - `validateNamePattern`
 * - `validateNameUniqueness`
 * @param name
 * @param allAnimals
 * @returns
 */
const validateName = (name: string, allAnimals: Animal[] | MiniAnimal[]) => {
  const validators = [
    () => validateNameLength(name),
    () => validateNamePattern(name),
    () => validateNameUniqueness(name, allAnimals),
  ];
  executeMultipleValidatorsForAField("name", validators);
};

/**
 * validateNameとはnameUniquenessのテスト方法が違う
 * @param name
 * @param allAnimals
 */
const inspectName = (name: string, allAnimals: Animal[] | MiniAnimal[]) => {
  const validators = [
    () => validateNameLength(name),
    () => validateNamePattern(name),
    // こちらはinspectNameUniqueness
    () => inspectNameUniqueness(name, allAnimals),
  ];
  executeMultipleValidatorsForAField("name", validators);
};

/**
 * sexがtype Sexのどれか
 * @param sex
 * @returns
 */
const validateSex = (sex: Sex) => {
  if (!sexValues.includes(sex)) {
    throw new AnimalFieldValidationErr("sex", ["性別が不正です"]);
  }
};

/**
 * family memberの数をチェック
 * @param type
 * @param family
 * @returns
 */
const validateMaxFamily = (type: "parents" | "children", family: string[]) => {
  const maxFamily = type === "parents" ? maxParents : maxChildren;
  if (family.length > maxFamily) {
    throw new AnimalFieldValidationErr(type, [
      `${familyMapping[type]}の数は${maxFamily}以下に設定してください`,
    ]);
  }
};

/**
 * family memberが別のfamily memberもしくは自分自身と重複していないかチェック
 * @param type
 * @param mainId
 * @param family
 * @param anotherFamily
 */
const validateFamilyDuplication = (
  type: "parents" | "children",
  mainId: string,
  family: string[],
  anotherFamily: string[]
) => {
  const errMsgs: string[] = [];
  family.forEach((member) => {
    if (member === mainId) {
      errMsgs.push(
        `自分自身を${familyMapping[type]}に追加することはできません`
      );
    }
    if (anotherFamily.includes(member)) {
      const reversedType = type === "parents" ? "children" : "parents";
      errMsgs.push(`${familyMapping[reversedType]}と重複している動物がいます`);
    }
  });
  if (errMsgs.length) {
    throw new AnimalFieldValidationErr(type, errMsgs);
  }
};

/**
 * familyのバリデーション
 * @param type
 * @param family
 */
const validateFamily = (
  type: "parents" | "children",
  mainId: string,
  family: string[],
  anotherFamily: string[]
) => {
  const validators = [
    () => validateMaxFamily(type, family),
    () => validateFamilyDuplication(type, mainId, family, anotherFamily),
  ];
  executeMultipleValidatorsForAField(type, validators);
};

/**
 * 正確にリンクされていればanimals全体のバリデーションでデータの検証が行われるので、リンクの確認のみ行う
 * @param type
 * @param boss
 * @param animals
 * @returns
 */
const inspectFamilyLink = (
  type: "parents" | "children", // 所属しているfamilyの種類
  id: string,
  family: string[],
  allAnimals: Animal[]
) => {
  const errMsgs: string[] = [];

  family.forEach((member) => {
    const originalMember = findAnimalById(member, allAnimals);

    if (originalMember) {
      // オリジナルメンバーが正しく見つかった場合
      const reversedType = type === "parents" ? "children" : "parents";
      if (originalMember[reversedType].includes(id)) {
        // オリジナルメンバーからも自分（id）が正しくリンクされている
        return; // 成功
      } else {
        // オリジナルメンバーから自分（id）が正しくリンクされていない
        errMsgs.push(
          `${member}：オリジナルの動物の${reversedType}に存在していません`
        );
      }
    } else {
      // オリジナルメンバーが見つからなかった場合
      errMsgs.push(`${member}：オリジナルの動物が見つかりません`);
    }
  });

  if (errMsgs.length) {
    throw new AnimalFieldValidationErr(type, errMsgs);
  }
};

/**
 * メモの文字数チェック
 * @param note
 * @returns
 */
const validateNote = (note: string) => {
  if (note.length > maxNote) {
    throw new AnimalFieldValidationErr("note", [
      `メモは${maxNote}文字以内で入力してください`,
    ]);
  }
};

/**
 * ownerIdがuserのid
 * @param ownerId
 * @param userId
 * @returns
 */
const inspectOwnerId = (ownerId: string, userId: string) => {
  if (ownerId !== userId) {
    throw new AnimalFieldValidationErr("ownerId", ["ownerIdが不正です"]);
  }
};

/**
 * visibilityがtype Visibilityのどれか
 * @param visibility
 * @returns
 */
const inspectVisibility = (visibility: string) => {
  if (visibility !== "private") {
    throw new AnimalFieldValidationErr("visibility", ["公開設定が不正です"]);
  }
};

/**
 * Timestampが24文字か27文字
 * @param createdAt
 * @returns
 */
const inspectTimestamp = (
  type: "createdAt" | "updatedAt",
  timestamp: string
) => {
  if (timestamp.length !== 24 && timestamp.length !== 27) {
    throw new AnimalFieldValidationErr(type, ["日時が不正です"]);
  }
};

const inspectModifier = (
  type: "createdBy" | "updatedBy",
  modifier: string,
  userId: string
) => {
  if (modifier !== userId) {
    throw new AnimalFieldValidationErr(type, [`${type}が不正です`]);
  }
};

/**
 * 必要に際してAnimalValidationErrをthrowする
 * 下記のバリデーター向け
 * - validateAnimal
 * - inspectAnimal
 * @param animalName
 * @param validators
 */
const throwAnimalValidationErrIfNeeded = (
  animalName: string,
  validators: (() => void)[]
) => {
  const animalFieldValidationErrs: AnimalFieldValidationErr[] = [];

  // バリデーションが必要なフィールドのみバリデーションを実行
  validators.forEach((validator) => {
    try {
      validator();
    } catch (err) {
      if (err instanceof AnimalFieldValidationErr) {
        animalFieldValidationErrs.push(err);
      }
    }
  });

  if (animalFieldValidationErrs.length) {
    throw new AnimalValidationErr(animalName, animalFieldValidationErrs);
  }
};

export type ValidatableField = "name" | "sex" | "parents" | "children" | "note";
/**
 * 与えられたフィールドについてのみバリデーションを実行する
 * @param data
 * @param allAnimals
 * @param allBaseAnimals
 */
export const validateAnimal = (
  animal: Animal,
  allAnimals: Animal[],
  fieldsToValidate: ValidatableField[]
) => {
  // フィールド名とそれに対応するバリデーター
  const FieldAndItsValidator = {
    name: () => validateName(animal.name, allAnimals),
    sex: () => validateSex(animal.sex),
    parents: () =>
      validateFamily("parents", animal.id, animal.parents, animal.children),
    children: () =>
      validateFamily("children", animal.id, animal.children, animal.parents),
    note: () => validateNote(animal.note),
  };

  // 実行するバリデーターを格納する配列
  const validators: (() => void)[] = [];

  // 与えられたフィールド名から実行するバリデーションを取得
  fieldsToValidate.forEach((field) => {
    validators.push(FieldAndItsValidator[field]);
  });

  // バリデーションを実行
  throwAnimalValidationErrIfNeeded(animal.name, validators);
};

const inspectAnimal = (
  animal: Animal,
  allAnimals: Animal[],
  userId: string,
  docId: string
) => {
  const validators = [
    () => inspectId(animal.id, docId),
    // validateNameではなくinspectNameを実行
    () => inspectName(animal.name, allAnimals),
    () => validateSex(animal.sex),
    () => validateFamily("parents", animal.id, animal.parents, animal.children),
    () =>
      validateFamily("children", animal.id, animal.children, animal.parents),
    () => inspectFamilyLink("parents", animal.id, animal.parents, allAnimals),
    () => inspectFamilyLink("children", animal.id, animal.children, allAnimals),
    () => validateNote(animal.note),
    () => inspectOwnerId(animal.ownerId, userId),
    () => inspectVisibility(animal.visibility),
    () => inspectTimestamp("createdAt", animal.createdAt),
    () => inspectTimestamp("createdAt", animal.createdAt),
    () => inspectTimestamp("updatedAt", animal.createdAt),
    () => inspectModifier("createdBy", animal.createdBy, userId),
    () => inspectModifier("updatedBy", animal.updatedBy, userId),
  ];

  // バリデーションを実行
  throwAnimalValidationErrIfNeeded(animal.name, validators);
};

export const inspectAnimals = (
  allAnimals: Animal[],
  docIds: string[],
  userId: string
) => {
  const animalValidationErrs: AnimalValidationErr[] = [];
  allAnimals.forEach((animal, i) => {
    try {
      inspectAnimal(animal, allAnimals, userId, docIds[i]);
    } catch (err) {
      if (err instanceof AnimalValidationErr) {
        animalValidationErrs.push(err);
      }
    }
  });
  if (animalValidationErrs.length) {
    throw new AnimalsValidationErr(animalValidationErrs);
  }
};
