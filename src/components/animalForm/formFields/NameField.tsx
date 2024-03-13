import { Label } from "../../generalUI/form/Label";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { Animal, maxAnimalName } from "../../../utils/common/definitions";
import { Dispatch, SetStateAction, useState } from "react";
import { formField, textInput } from "../../../utils/css";
import { validateName } from "../../../utils/animal/validators";
import { set } from "firebase/database";

export const NameField = ({
  name,
  setName,
  allAnimals,
}: {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  allAnimals: Animal[];
}) => {
  const [errMsg, setErrMsg] = useState<string | null>(null);

  return (
    <div className={formField}>
      <Label htmlFor="name" required={true}>
        名前
      </Label>
      <input
        id="name"
        name="name"
        placeholder="（必須）一意の動物のID、名称、ニックネームなど"
        required={true}
        maxLength={maxAnimalName}
        autoFocus={true}
        value={name}
        onChange={(e) => {
          setErrMsg(null);
          setName(e.target.value);
          const msg = validateName(e.target.value, allAnimals);
          msg && setErrMsg(msg);
        }}
        className={textInput}
      />
      <div className="text-red-500 text-xs">{errMsg}</div>
      <TextLengthIndicator
        currentLength={name.length}
        maxLength={maxAnimalName}
      />
      <div></div>
    </div>
  );
};
