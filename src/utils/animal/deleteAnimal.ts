import { WriteBatch } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { modifyLatestAllAnimals } from "./utils";
import { Animal } from "./definitions";

export const deleteAnimal = (
  animal: Animal,
  userId: string,
  batch: WriteBatch,
  latestAllAnimals: Animal[]
) => {
  const ref = doc(collection(db, "users", userId, "animals"), animal.id);
  // 削除処理
  batch.delete(ref);
  // latestAllAnimalsを更新
  modifyLatestAllAnimals("deleted", animal, latestAllAnimals);
};
