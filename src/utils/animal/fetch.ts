import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import useSWR from "swr";
import { Animal } from "./definitions";

// https://swr.vercel.app/ja/docs/api.ja#options
export const useSWRAnimals = (userId: string) => {
  return useSWR(
    "animals",
    async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "animals")
        );
        const animals = querySnapshot.docs.map((doc) => doc.data());
        return animals as Animal[];
      } catch (err) {
        // 独自のエラーを投げる
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
