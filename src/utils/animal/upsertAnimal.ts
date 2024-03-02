import { WriteBatch, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Sex, Animal } from "./definitions";
import { getTimestamp } from "./utils";
import { ValidatableField, validateAnimal } from "./validators";
import { modifyLatestAllAnimals } from "./utils";

/**
 * 既存の動物情報を更新。新規動物にも使用可能。
 * `id`を外から渡す理由
 * - mainAnimalの作成、更新時には新規作成されたfamilyのidが必要なため。familyを先に作るとしても新規mainAnimalのidが必要になる。
 * @param data
 * @param user
 * @param batch
 * @param prevAnimal
 * @returns
 */
export const upsertAnimal = (
  data:
    | {
        // createのとき
        id: string;
        name: string;
        sex?: Sex;
        parents?: string[];
        children?: string[];
        note?: string;
        createdBy: string;
      }
    | {
        // updateのとき
        name?: string;
        sex?: Sex;
        parents?: string[];
        children?: string[];
        note?: string;
        updatedBy: string;
        prevAnimal: Animal;
      },
  userId: string,
  batch: WriteBatch,
  latestAllAnimals: Animal[]
) => {
  let isCreate: boolean = false;
  let animalToUpsert: Animal;

  // 一旦全てのフィールドをバリデーション対象にする
  const fieldsToValidate: ValidatableField[] = [
    "sex",
    "parents",
    "children",
    "note",
  ];

  if ("createdBy" in data) {
    // createのとき
    isCreate = true;
    animalToUpsert = {
      id: data.id,
      name: data.name,
      sex: data.sex || "",
      parents: data.parents || [],
      children: data.children || [],
      note: data.note || "",
      ownerId: userId,
      visibility: "private",
      createdAt: getTimestamp(),
      createdBy: data.createdBy,
      updatedAt: getTimestamp(),
      updatedBy: data.createdBy, // createdByを流用
    };

    // バリデーション関係
    fieldsToValidate.push("name");
  } else {
    // updateのとき
    const prevAnimal = data.prevAnimal;
    animalToUpsert = {
      id: prevAnimal.id,
      name: data.name || prevAnimal.name,
      sex: data.sex || prevAnimal.sex,
      parents: data.parents || prevAnimal.parents,
      children: data.children || prevAnimal.children,
      note: data.note || prevAnimal.note,
      ownerId: userId,
      visibility: "private",
      createdAt: prevAnimal.createdAt,
      createdBy: prevAnimal.createdBy,
      updatedAt: getTimestamp(),
      updatedBy: data.updatedBy,
    };

    // バリデーション関係
    if (animalToUpsert.name !== prevAnimal.name) {
      // 名前が変更されたとき
      fieldsToValidate.push("name");
    }
  }

  // バリデーションに失敗した時はValidationErrを投げる
  validateAnimal(animalToUpsert, latestAllAnimals, fieldsToValidate);

  const ref = doc(db, "users", userId, "animals", animalToUpsert.id);
  batch.set(ref, animalToUpsert);

  // latestAllAnimalsを更新
  modifyLatestAllAnimals(
    isCreate ? "created" : "updated",
    animalToUpsert,
    latestAllAnimals
  );

  return animalToUpsert;
};
