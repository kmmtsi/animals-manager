import { Animal, Sex } from "../common/definitions";
import { getNewRef, getTimestamp } from "../common/utils";

export const createAnimal = (
  data: {
    name: string;
    sex: Sex;
    note: string;
  },
  userId: string
) => {
  const animal: Animal = {
    id: getNewRef(userId, "animals").id,
    ...data,
    sourcePair: "",
    selfPairs: [],
    ownerId: userId,
    visibility: "private",
    createdAt: getTimestamp(),
    createdBy: userId,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };

  return animal;
};
