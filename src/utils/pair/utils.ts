import { Animal, MiniAnimal, Pair } from "../common/definitions";

export const findPairById = (id: string, pairs: Pair[]) =>
  pairs.find((pair) => pair.id === id);

export const getPairById = (id: string, pairs: Pair[]) => {
  const pair = findPairById(id, pairs);
  if (!pair) {
    throw new Error(`id: ${id}をもつペアが見つかりません`);
  }
  return pair;
};

export const isMemberIncluded = (
  memberToTest: MiniAnimal,
  members: MiniAnimal[]
) => members.some((member) => member.id === memberToTest.id);

export const isMembersSame = (
  members: MiniAnimal[],
  membersToTest: MiniAnimal[] | undefined
) => {
  if (!membersToTest) {
    return false;
  }
  if (members.length !== membersToTest.length) {
    return false;
  }
  return members.every((member) =>
    membersToTest.some((memberToTest) => memberToTest.id === member.id)
  );
};

export const getFilteredIds = (idToRemove: string, ids: string[]) =>
  ids.filter((id) => id !== idToRemove);

export const getSuggestableMiniAnimals = (
  type: "pairedAnimals" | "children",
  pairedAnimals: MiniAnimal[],
  children: MiniAnimal[],
  allAnimals: Animal[]
): MiniAnimal[] => {
  const animals = allAnimals.filter((animal) => {
    return (
      // childrenのときは他のペアで未使用の動物のみ
      (type === "pairedAnimals" ? true : animal.sourcePair === "") &&
      // pairedAnimalsに未使用
      !pairedAnimals.some((paired) => paired.id === animal.id) &&
      // childrenに未使用
      !children.some((child) => child.id === animal.id)
    );
  });
  return animals.map((animal) => ({
    id: animal.id,
    name: animal.name,
    sex: animal.sex,
  }));
};
