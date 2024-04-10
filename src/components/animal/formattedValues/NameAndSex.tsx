import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Animal, MiniAnimal } from "../../../utils/common/definitions";

export type OnAnimalClick = (animalId: string) => void;

export const NameAndSex = ({
  animal,
  onAnimalClick,
}: {
  animal: Animal | MiniAnimal;
  onAnimalClick?: OnAnimalClick;
}) => {
  const { id, name, sex } = animal;

  return (
    <div
      data-id={id}
      className={`w-fit ${
        onAnimalClick ? "border-b border-slate-300 cursor-pointer" : ""
      }`}
      onClick={() => onAnimalClick && onAnimalClick(id)}
    >
      <span className="break-all">{name}</span>
      {sex === "male" && (
        <FontAwesomeIcon
          icon={faMars}
          className="scale-90 ml-1 text-blue-500"
        />
      )}
      {sex === "female" && (
        <FontAwesomeIcon
          icon={faVenus}
          className="scale-90 ml-1 text-pink-500"
        />
      )}
    </div>
  );
};
