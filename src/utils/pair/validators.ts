import { MiniAnimal, maxChildren } from "../common/definitions";

export const validateMembersNum = (
  pairedAnimals: MiniAnimal[],
  children: MiniAnimal[]
) => {
  const pL = pairedAnimals.length;
  const cL = children.length;

  if (cL > maxChildren) {
    return "子の数が多すぎます";
  } else if (pL === 0) {
    if (cL === 0) {
      return "ペアが空です";
    } else if (cL === 1) {
      // これにより兄弟関係か親子関係が成立する
      return "親か子のどちらかをもう1匹以上登録してください";
    } else {
      return null; // OK
    }
  } else if (pL === 1) {
    if (cL === 0) {
      return "親か子のどちらかをもう1匹以上登録してください";
    } else {
      return null; // OK
    }
  } else if (pL === 2) {
    return null; // OK
  } else {
    return "ペアリングする動物が多すぎます";
  }
};