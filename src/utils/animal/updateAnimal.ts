import { Animal, Sex } from "../common/definitions";
import { getTimestamp } from "../common/utils";

export const updateAnimal = (
  data: {
    name?: string;
    sex?: Sex;
    sourcePair?: string;
    selfPairs?: string[];
    note?: string;
  },
  userId: string,
  prevAnimal: Animal
) => {
  const { name, sex, sourcePair, selfPairs, note } = data;

  const animal: Animal = {
    id: prevAnimal.id,
    name: name ?? prevAnimal.name,
    sex: sex ?? prevAnimal.sex,
    sourcePair: sourcePair ?? prevAnimal.sourcePair,
    selfPairs: selfPairs ?? prevAnimal.selfPairs,
    note: note ?? prevAnimal.note,
    ownerId: userId,
    visibility: "private",
    createdAt: getTimestamp(),
    createdBy: userId,
    updatedAt: getTimestamp(),
    updatedBy: userId,
  };

  return animal;
};
