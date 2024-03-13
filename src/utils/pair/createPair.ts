import { MiniAnimal, Pair } from "../common/definitions";
import { getNewRef, getTimestamp } from "../common/utils";

export const createPair = (
  data: {
    pairedAnimals: MiniAnimal[];
    children: MiniAnimal[];
  },
  userId: string
) => {
  const pair: Pair = {
    id: getNewRef(userId, "pairs").id,
    pairedAnimals: data.pairedAnimals,
    children: data.children,
    createdAt: getTimestamp(),
    createdBy: userId,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };

  return pair;
};
