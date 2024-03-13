import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Animal, MiniAnimal } from "../../utils/common/definitions";
import { animalLink } from "../../utils/css";

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
      {name}
      {sex === "male" && (
        <FontAwesomeIcon icon={faMars} className="text-xs ml-1 text-blue-500" />
      )}
      {sex === "female" && (
        <FontAwesomeIcon
          icon={faVenus}
          className="text-xs ml-1 text-pink-500"
        />
      )}
    </div>
  );

  return isLink ? <Link to={`/animal/${id}`}>{body}</Link> : body;
};
