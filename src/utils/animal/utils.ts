import { Animal, MiniAnimal } from "../common/definitions";

// リストの中からIdを元に動物を探す
export const findAnimalById = <T extends Animal | MiniAnimal>(
  id: string,
  animals: T[]
) => animals.find((animal) => animal.id === id);

/**
 * 動物が見つからない場合エラーを投げる
 * @param id
 * @param animals
 * @returns
 */
export const getAnimalById = <T extends Animal | MiniAnimal>(
  id: string,
  animals: T[]
) => {
  const animal = findAnimalById(id, animals);
  if (animal) {
    return animal;
  } else {
    throw new Error(`id: ${id}をもつ動物が見つかりません`);
  }
};

// リストの中からnameを元に動物を探す
export const findAnimalByName = <T extends Animal | MiniAnimal>(
  name: string,
  animals: T[]
) => animals.find((animal) => animal.name === name);

/**
 * animalをMiniAnimalに変換
 * @param animal
 * @returns
 */
export const convertAnimalToMini = (animal: Animal): MiniAnimal => ({
  id: animal.id,
  name: animal.name,
  sex: animal.sex,
});

/**
 * animalsをMiniAnimalsに変換
 * @param animals
 * @returns
 */
export const convertAnimalsToMinis = (animals: Animal[]): MiniAnimal[] =>
  animals.map((animal) => convertAnimalToMini(animal));

export const isSelfPairsChanged = (
  selfPairs: string[],
  prevSelfPairs: string[] | undefined
) => {
  return (
    !prevSelfPairs ||
    selfPairs.length !== prevSelfPairs.length ||
    selfPairs.some((pair) => !prevSelfPairs.includes(pair))
  );
};

/******************
 * Animalsのソート *
 ******************/
export type SortTarget = "name" | "createdAt" | "updatedAt";

type SortOrder = "asc" | "desc";

export type SortMethod = {
  target: SortTarget;
  order: SortOrder;
};

export const getSortedAnimals = (animals: Animal[], sortMethod: SortMethod) => {
  const { target, order } = sortMethod;

  switch (target) {
    case "name":
      // 名前でソートした配列を返す
      return animals.sort((a, b) => {
        if (order === "asc") {
          return b.name.localeCompare(a.name);
        } else {
          return a.name.localeCompare(b.name);
        }
      });
    case "createdAt":
    case "updatedAt":
      // createdAtもしくはupdatedAtでソートした配列を返す
      return animals.sort((a, b) => {
        if (order === "asc") {
          return Date.parse(a[target]) - Date.parse(b[target]);
        } else {
          return Date.parse(b[target]) - Date.parse(a[target]);
        }
      });
  }
};
