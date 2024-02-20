import { Animal } from "../definitions";
import { KeyedMutator } from "swr";
import { mutateAnimals } from "../utils";
import { writeBatch } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, collection } from "firebase/firestore";
import { User } from "firebase/auth";
import { updateAnimal } from "./updateAnimal";
import { getAnimalById } from "../utils";
import { getWriteResultMsgs } from "../utils";

export const deleteAnimals = async (
  animalsToDelete: Animal[],
  user: User,
  animals: Animal[],
  mutate: KeyedMutator<Animal[]>
) => {
  // batchを初期化
  const batch = writeBatch(db);

  const updatedAnimals: Animal[] = [];

  // 削除するanimalsに対してループ処理
  animalsToDelete.forEach((animal) => {
    // animalを削除
    const ref = doc(collection(db, "users", user.uid, "animals"), animal.id);
    batch.delete(ref);

    // parentsを更新
    animal.parents.forEach((parent) => {
      const updatedParent = updateAnimal(
        {
          children: {
            operation: "remove",
            data: [animal], // mainAnimalを除外
          },
        },
        user,
        batch,
        getAnimalById(parent.id, animals) as Animal
      );
      updatedAnimals.push(updatedParent);
    });

    // childrenを更新
    animal.children.forEach((child) => {
      const updatedChildren = updateAnimal(
        {
          parents: {
            operation: "remove",
            data: [animal], // mainAnimalを除外
          },
        },
        user,
        batch,
        getAnimalById(child.id, animals) as Animal
      );
      updatedAnimals.push(updatedChildren);
    });
  });

  try {
    // batchを実行
    await batch.commit();

    // batch処理が成功した場合のみmutate
    mutateAnimals(mutate, animals, {
      updatedAnimals,
      deletedAnimals: animalsToDelete,
    });

    return {
      status: "success",
      msgs: getWriteResultMsgs({
        updatedAnimals,
        deletedAnimals: animalsToDelete,
      }),
    };
  } catch (err) {
    return { status: "err", msgs: getWriteResultMsgs() };
  }
};
