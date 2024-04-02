import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Animal, MiniAnimal } from "../../utils/common/definitions";
import { animalLink } from "../../utils/css";
import { getPathToAnimalPage } from "../../utils/common/pageUtils";

export const NameAndSex = ({
  animal,
  isLink,
}: {
  animal: Animal | MiniAnimal;
  isLink?: boolean;
}) => {
  const { id, name, sex } = animal;

  const body = (
    <div data-id={id} className={`w-fit ${isLink ? animalLink : ""}`}>
      <span className="break-all">{name}</span>
      {sex === "male" && (
        <FontAwesomeIcon icon={faMars} className="scale-90 ml-1 text-blue-500" />
      )}
      {sex === "female" && (
        <FontAwesomeIcon
          icon={faVenus}
          className="scale-90 ml-1 text-pink-500"
        />
      )}
    </div>
  );

  return isLink ? <Link to={getPathToAnimalPage(id)}>{body}</Link> : body;
};
