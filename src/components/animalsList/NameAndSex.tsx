import { Sex } from "../../utils/animal/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";

export const NameAndSex = ({ name, sex }: { name: string; sex: Sex }) => {
  return (
    <div className="flex gap-x-0.5 items-start justify-center">
      {/* 性別アイコン */}
      <div
        className={`flex items-center justify-center text-xs h-4 aspect-square rounded-full mt-1 ${
          sex === ""
            ? "text-slate-500"
            : sex === "male"
            ? "text-blue-500"
            : sex === "female"
            ? "text-pink-500"
            : ""
        }`}
      >
        {sex === "" && <span></span>}
        {sex === "male" && <FontAwesomeIcon icon={faMars} />}
        {sex === "female" && <FontAwesomeIcon icon={faVenus} />}
      </div>
      {name}
    </div>
  );
};
