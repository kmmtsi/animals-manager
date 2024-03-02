import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";
import { Animal } from "./definitions";
import { AnimalsValidationErr, inspectAnimals } from "./validators";

// https://swr.vercel.app/ja/docs/api.ja#options
// https://ja.javascript.info/custom-errors

// TODO: エラー時の呼び出し回数制限を実装する

export const useFetchAnimals = (userId: string) => {
  return useSWR(
    "animals",
    async () => {
      let querySnapshot;

      try {
        querySnapshot = await getDocs(
          collection(db, "users", userId, "animals")
        );
      } catch (err) {
        throw new Error("データベースの読み込みでエラーが発生しました");
      }

      const animalDocs = querySnapshot.docs;
      const animals = animalDocs.map((doc) => doc.data()) as Animal[];
      const docIds = animalDocs.map((doc) => doc.id);

      // DB中身の検証
      // エラーがある場合はエラーが投げられる
      try {
        inspectAnimals(animals, docIds, userId);
      } catch (err) {
        if (err instanceof AnimalsValidationErr) {
          // エラーをログに出力
          console.log(err.animalValidationErrs);
          // エラーを投げる
          throw new Error(err.message);
        }
      }

      return animals;
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
