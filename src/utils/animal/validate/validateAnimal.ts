import { validateName, validateFamily } from "./validateUtils";
import { BaseAnimal } from "../definitions";

// バリデーション関数の戻り値の型
export type ValidationResult = null | {
  name: string[];
  parents: string[];
  children: string[];
};

// バリデーション関数の型
export type ValidateAnimal = (
  name: string,
  parents: BaseAnimal[],
  children: BaseAnimal[],
  baseAnimals: BaseAnimal[],
  changedFields: string[]
) => ValidationResult;

export const validateAnimal: ValidateAnimal = (
  name,
  parents,
  children,
  baseAnimals,
  changedFields
) => {
  let nameErrMsgs: string[] = [];
  let parentsErrMsgs: string[] = [];
  let childrenErrMsgs: string[] = [];

  // 変更されたフィールドのみバリデーション
  changedFields.forEach((field) => {
    switch (field) {
      case "name": {
        const res = validateName(name, parents, children, baseAnimals);
        nameErrMsgs = res;
        break;
      }
      case "sex": {
        break;
      }
      case "parents": {
        const res = validateFamily(name, parents, children, baseAnimals);
        parentsErrMsgs = res;
        break;
      }
      case "children": {
        const res = validateFamily(name, children, parents, baseAnimals);
        childrenErrMsgs = res;
        break;
      }
      case "note": {
        break;
      }
    }
  });

  if (
    !nameErrMsgs.length &&
    !parentsErrMsgs.length &&
    !childrenErrMsgs.length
  ) {
    // 問題なし
    return null;
  } else {
    // エラーあり
    return {
      name: nameErrMsgs,
      parents: parentsErrMsgs,
      children: childrenErrMsgs,
    };
  }
};
