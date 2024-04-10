import { NavigateFunction } from "react-router-dom";
import { Animal, MiniAnimal } from "../../utils/common/definitions";
import { getPathToAnimalPage } from "../../utils/common/pageUtils";
import { hover } from "../../utils/css";
import { NameAndSex } from "./formattedValues/NameAndSex";

export const AnimalChip = ({
  animal,
  options,
}: {
  animal: Animal | MiniAnimal;
  options?: {
    navigate?: NavigateFunction;
  };
}) => {
  const navigate = options?.navigate;

  return (
    <div
      className={`bg-slate-50 font-semibold border rounded-full px-3 py-1 w-fit ${
        navigate ? `${hover} cursor-pointer` : ""
      }`}
      onClick={() => navigate && navigate(getPathToAnimalPage(animal.id))}
    >
      <NameAndSex animal={animal} />
    </div>
  );
};
