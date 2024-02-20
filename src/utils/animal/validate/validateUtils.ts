import { BaseAnimal, minLengthForAnimalName } from "../definitions";
import { maxLengthForAnimalName } from "../definitions";
import { isNewAnimal } from "../utils";

const isValidLength = (
  text: string,
  maxLength: number,
  minLength: number = 0
) => {
  if (!(text.length >= minLength && text.length <= maxLength)) {
    return `${minLength}文字以上${maxLength}文字以内で入力してください`;
  }
  return null;
};

// 指定したanimals群の中に同じ名前が無いかチェック
const isNameUnique = (name: string, animals: BaseAnimal[]) => {
  if (animals.some((animal) => animal.name === name)) {
    return "同じ名前が既に登録されているか他の場所で使用されています";
  }
  return null;
};

const isNameUniqueInAField = (animals: BaseAnimal[]) => {
  // そのフィールド内でのnameの重複NG
  if (animals.length > 1) {
    const names = animals.map((animal) => animal.name);
    if (new Set(names).size !== names.length) {
      return "同じ名前が複数回使用されています";
    }
  }
  return null;
};

// nameのバリデーション
export const validateName = (
  name: string,
  parents: BaseAnimal[],
  children: BaseAnimal[],
  baseAnimals: BaseAnimal[]
) => {
  const errMsgs = [];

  // nameの文字数チェック
  const res1 = isValidLength(
    name,
    maxLengthForAnimalName,
    minLengthForAnimalName
  );
  res1 && errMsgs.push(res1);

  // collection間で一意
  const res2 = isNameUnique(name, baseAnimals);
  res2 && errMsgs.push(res2);

  // parentsとの重複NG
  const res3 = isNameUnique(name, parents);
  res3 && errMsgs.push(res3);

  // childrenとの重複NG
  const res4 = isNameUnique(name, children);
  res4 && errMsgs.push(res4);

  return errMsgs;
};

// familyのバリデーション
// ComboBox内でのフィルタリングでカバーできているところも多いが念のため
export const validateFamily = (
  name: string,
  family1: BaseAnimal[],
  family2: BaseAnimal[],
  baseAnimals: BaseAnimal[]
) => {
  const errMsgs = [];

  // 各メンバーのバリデーション
  family1.forEach((member) => {
    const memberName = member.name;
    {
      // nameの文字数チェック
      const res = isValidLength(
        memberName,
        maxLengthForAnimalName,
        minLengthForAnimalName
      );
      res && errMsgs.push(res);
    }
    {
      // mainAnimalとの重複NG
      const res = isNameUnique(memberName, [{ id: "", name, sex: "" }]);
      res && errMsgs.push(res);
    }
    {
      // parents-children間で重複NG
      const res = isNameUnique(memberName, family2);
      res && errMsgs.push(res);
    }
    if (isNewAnimal(member, baseAnimals)) {
      // 新規の場合collection間で一意
      const res = isNameUnique(memberName, baseAnimals);
      res && errMsgs.push(res);
    }
  });

  // family間で一意
  const res = isNameUniqueInAField(family1);
  res && errMsgs.push(res);

  return errMsgs;
};
