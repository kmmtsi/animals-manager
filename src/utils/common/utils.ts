import { FirebaseError } from "firebase/app";
import { collection, doc, getDocs } from "firebase/firestore";
import useSWR, { KeyedMutator } from "swr";
import { db } from "../firebase";
import { Animal, Pair } from "./definitions";
import { FieldValidationErr } from "./validators";

export const getNewRef = (
  userId: string,
  collectionName: "animals" | "pairs"
) => doc(collection(db, "users", userId, collectionName));

export const getRef = (
  userId: string,
  collectionName: "animals" | "pairs",
  id: string
) => doc(db, "users", userId, collectionName, id);

// 書き込み完了後にanimalsを更新
export const mutateDocs = <T extends Animal | Pair>(
  mutator: KeyedMutator<T[]>,
  newDocs: T[]
) => {
  mutator(newDocs, {
    revalidate: false, // 再検証を行わない
  });
};

/**
 * DBへの書き込み結果やバリデーション結果の型
 */
export type WriteResult = { status: "success" | "err"; msgs: string[] };

// https://swr.vercel.app/ja/docs/api.ja#options
// https://ja.javascript.info/custom-errors
// TODO: エラー時の呼び出し回数制限を実装する
export const useFetchDocs = <T extends Animal | Pair>(
  userId: string,
  collectionName: T extends Animal ? "animals" : "pairs"
) => {
  return useSWR(
    collectionName,
    async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, collectionName)
        );
        const docs = querySnapshot.docs;
        const data = docs.map((doc) => doc.data()) as T[];
        return data;
      } catch (err) {
        throw new Error("データベースの読み込みでエラーが発生しました");
      }
    },
    {
      // 古いキャッシュでも再検証しない
      revalidateIfStale: false,
      // 当該のtabにフォーカス時に再検証しない
      revalidateOnFocus: false,
      // ネット回復時に再検証しない
      revalidateOnReconnect: false,
      // revalidateOnMount: false -> fetch自体が実行されないのでNG
      // revalidateOnMount: true -> mountの度にfetchが実行されるのでNG
    }
  );
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
export const getDateObj = (timestamp: string) => new Date(timestamp);

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
 * DB書き込み時のエラーメッセージを取得
 * @param err
 * @returns
 */
export const convertErrToMsgs = (err: unknown): string[] => {
  // 開発環境時にはエラーをコンソールに出力
  if (import.meta.env.DEV) console.error(err);

  if (err instanceof FieldValidationErr) {
    return [`${err.docId}: ${err.message}`];
  } else if (err instanceof FirebaseError) {
    return ["データベースへの書き込みでエラーが発生しました"];
  } else {
    return ["不明なエラーが発生しました"];
  }
};

export const modifyCopiedDocs = <T extends Animal | Pair>(
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
