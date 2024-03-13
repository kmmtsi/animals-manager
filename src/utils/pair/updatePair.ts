import { MiniAnimal, Pair } from "../common/definitions";
import { getTimestamp } from "../common/utils";

export const updatePair = (
  data: {
    pairedAnimals?: MiniAnimal[];
    children?: MiniAnimal[];
  },
  userId: string,
  prevPair: Pair
) => {
  const { pairedAnimals, children } = data;

  const pair: Pair = {
    id: prevPair.id,
    pairedAnimals: pairedAnimals ?? prevPair.pairedAnimals,
    children: children ?? prevPair.children,
    createdAt: prevPair.createdAt,
    createdBy: prevPair.createdBy,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };

  return pair;
};
