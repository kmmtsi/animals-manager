import { MiniAnimal } from "../../utils/animal/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const NameAndSex = ({
  animal,
  isLink,
}: {
  animal: MiniAnimal;
  isLink?: boolean;
}) => {
  const { id, name, sex } = animal;
  const body = (
    <div data-id={id} className="flex gap-x-0.5 items-start justify-center">
      {name}
      {sex !== "" && (
        // 性別アイコン
        <div
          className={`flex items-center justify-center text-xs h-4 aspect-square rounded-full mt-1 ${
            sex === "male"
              ? "text-blue-500"
              : sex === "female"
              ? "text-pink-500"
              : ""
          }`}
        >
          {sex === "male" && <FontAwesomeIcon icon={faMars} />}
          {sex === "female" && <FontAwesomeIcon icon={faVenus} />}
        </div>
      )}
    </div>
  );

  return isLink ? (
    <Link
      to={`/${animal.id}`}
      className="underline underline-offset-2 decoration-1 decoration-slate-300"
    >
      {body}
    </Link>
  ) : (
    body
  );
};
