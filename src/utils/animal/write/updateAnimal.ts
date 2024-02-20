import { WriteBatch, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { User } from "firebase/auth";
import { Sex, Parent, Child, Animal } from "../definitions";
import { getTimeStamp } from "../../db/utils";
import { getUpdatedFamily } from "../utils";

export type OperationToFamily = "replace" | "add" | "remove";

// 既存の動物情報を更新
export const updateAnimal = (
  data: {
    name?: string;
    sex?: Sex;
    parents?: {
      operation: OperationToFamily;
      data: Parent[];
    };
    children?: {
      operation: OperationToFamily;
      data: Child[];
    };
    note?: string;
  },
  user: User,
  batch: WriteBatch,
  prevAnimal: Animal
) => {
  const { name, sex, parents, children, note } = data;

  // 引数として与えられていないフィールドは過去のデータでそもまま上書きする
  const updatedAnimal: Animal = {
    id: prevAnimal.id, // 変更なし
    name: name || prevAnimal.name,
    sex: sex || prevAnimal.sex,
    parents: parents
      ? getUpdatedFamily(parents.operation, parents.data, prevAnimal.parents)
      : prevAnimal.parents,
    children: children
      ? getUpdatedFamily(children.operation, children.data, prevAnimal.children)
      : prevAnimal.children,
    note: note || prevAnimal.note,
    ownerId: prevAnimal.ownerId, // 変更なし
    visibility: prevAnimal.visibility, // 変更なし
    createdAt: prevAnimal.createdAt, // 変更なし
    updatedAt: getTimeStamp(), // 必ず更新
  };

  const ref = doc(db, "users", user.uid, "animals", prevAnimal.id);
  batch.set(ref, updatedAnimal);

  return updatedAnimal;
};
