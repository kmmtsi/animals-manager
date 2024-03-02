import { Animal } from "./definitions";
import { KeyedMutator } from "swr";
import { findAnimalById, getUpdatedFamily, mutateAnimals } from "./utils";
import { writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { upsertAnimal } from "./upsertAnimal";
import { getAnimalById } from "./utils";
import { getWriteResultMsgs } from "./utils";
import { WriteResult } from "./utils";
import { deleteAnimal } from "./deleteAnimal";

export const deleteAnimals = async (
  animalsToDelete: Animal[],
  userId: string,
  allAnimals: Animal[],
  mutate: KeyedMutator<Animal[]>
): Promise<WriteResult> => {
  // batchを初期化
  const batch = writeBatch(db);

  // 更新した動物一覧
  const updatedAnimals: Animal[] = [];

  // animalsを随時更新していくためのコピーを作成
  const latestAllAnimals = [...allAnimals];

  // 削除するanimalsに対してループ処理
  animalsToDelete.forEach((animalToDelete) => {
    // animalを削除
    deleteAnimal(animalToDelete, userId, batch, latestAllAnimals);

    // parentsを更新
    animalToDelete.parents.forEach((parent) => {
      if (!findAnimalById(parent, animalsToDelete)) {
        // animalsToDeleteに含まれている動物は結局削除されるので更新から除外
        const prevParent = getAnimalById(parent, latestAllAnimals);
        updatedAnimals.push(
          upsertAnimal(
            {
              children: getUpdatedFamily(
                "remove",
                [animalToDelete.id],
                prevParent.children
              ),
              updatedBy: userId,
              prevAnimal: prevParent,
            },
            userId,
            batch,
            latestAllAnimals
          )
        );
      }
    });

    // childrenを更新
    animalToDelete.children.forEach((child) => {
      if (!findAnimalById(child, animalsToDelete)) {
        // animalsToDeleteに含まれていない場合のみchildをupdate
        const prevChild = getAnimalById(child, latestAllAnimals);
        updatedAnimals.push(
          upsertAnimal(
            {
              parents: getUpdatedFamily(
                "remove",
                [animalToDelete.id],
                prevChild.parents
              ),
              updatedBy: userId,
              prevAnimal: prevChild,
            },
            userId,
            batch,
            latestAllAnimals
          )
        );
      }
    });
  });

  // batchを実行
  await batch.commit();

  // batch処理が成功した場合のみmutate
  mutateAnimals(mutate, latestAllAnimals);

  return {
    status: "success",
    msgs: getWriteResultMsgs({
      updatedAnimals,
      deletedAnimals: animalsToDelete,
    }),
  };
};
