import { doc, WriteBatch, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";
import { Sex, Parent, Child, Animal } from "../definitions";
import { getTimeStamp } from "../../db/utils";

// 動物を新規作成
export const createAnimal = (
  data: {
    id: string;
    name: string;
    sex: Sex;
    parents?: Parent[];
    children?: Child[];
    note?: string;
  },
  user: User,
  batch: WriteBatch
) => {
  const { id, name, sex, parents, children, note } = data;

  const createdAnimal: Animal = {
    id,
    name,
    sex,
    parents: parents || [],
    children: children || [],
    note: note || "",
    // 以下ユーザー入力のないフィールド
    ownerId: user.uid,
    visibility: "private",
    createdAt: getTimeStamp(),
    updatedAt: getTimeStamp(),
  };

  const ref = doc(collection(db, "users", user.uid, "animals"), id);
  batch.set(ref, createdAnimal);

  return createdAnimal;
};
