import { FirebaseError } from "firebase/app";
import { collection, doc } from "firebase/firestore";
import { KeyedMutator } from "swr";
import i18n from "../../i18n/config";
import { db } from "../firebase";
import { Animal, Breeding, Folder } from "./definitions";

export const getNewRef = (
  userId: string,
  collectionName: "animals" | "breedings" | "animalsFolders" | "breedingsFolders"
) => doc(collection(db, "users", userId, collectionName));

export const getRef = (
  userId: string,
  collectionName: "animals" | "breedings" | "animalsFolders" | "breedingsFolders",
  id: string
) => doc(db, "users", userId, collectionName, id);

// 書き込み完了後にanimalsを更新
export const mutateDocs = async <T extends Animal | Breeding | Folder>(
  mutator: KeyedMutator<T[]>,
  newDocs: T[]
) =>
  await mutator(newDocs, {
    revalidate: false, // 再検証を行わない
  });

/**
 * DBへの書き込み結果やバリデーション結果の型
 */
export type WriteResult = { status: "success" | "err"; msgs: string[] };

// 日付の処理
// https://qiita.com/__knm__/items/3c7466a19abdf5192d11
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
// https://developer.mozilla.org/ja/docs/Web/HTML/Element/time
/**
 * 現在時刻のタイムスタンプを取得
 * @returns
 */

export const getTimestamp = () => new Date().toISOString();

export const convertTsToLocalDateString = (timestamp: string) => {
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleDateString();
};

export const convertDateToLocalDateString = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};

export const convertErrToMsg = (err: unknown): string => {
  if (import.meta.env.DEV) console.error(err);
  if (err instanceof FirebaseError) {
    return i18n.t("dbWriteErr");
  } else if (err instanceof CustomErr) {
    return err.message;
  } else {
    return i18n.t("unknownErr");
  }
};

export const modifyCopiedDocs = <T extends Animal | Breeding | Folder>(
  operation: "created" | "updated" | "deleted",
  doc: T,
  docs: T[]
) => {
  switch (operation) {
    case "created":
      docs.push(doc);
      break;
    case "updated":
      {
        const index = docs.findIndex((docItem) => docItem.id === doc.id);
        docs[index] = doc;
      }
      break;
    case "deleted":
      {
        const index = docs.findIndex((docItem) => docItem.id === doc.id);
        docs.splice(index, 1);
      }
      break;
  }
};

export class CustomErr extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomErr";
  }
}

export const isArraysEqual = (arry1: string[], arry2: string[]) => {
  if (arry1.length !== arry2.length) return false;
  arry1.sort();
  arry2.sort();
  for (let i = 0; i < arry1.length; i++) {
    if (arry1[i] !== arry2[i]) return false;
  }
  return true;
};
