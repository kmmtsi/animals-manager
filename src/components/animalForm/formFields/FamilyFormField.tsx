import { Label } from "../../generalUI/form/Label";
import { MiniAnimal, familyMapping } from "../../../utils/common/definitions";
import { FamilyInput } from "../comboBox/FamilyInput";
import { Dispatch, SetStateAction } from "react";
import { formField } from "../../../utils/css";

export const FamilyFormField = ({
  type,
  miniFamily,
  setMiniFamily,
  allMiniAnimals,
  miniAnimalsInUse,
}: {
  type: "parents" | "children";
  miniFamily: MiniAnimal[];
  setMiniFamily: Dispatch<SetStateAction<MiniAnimal[]>>;
  allMiniAnimals: MiniAnimal[];
  miniAnimalsInUse: MiniAnimal[];
}) => {
  const familyName = familyMapping[type];

  return (
    <div className={formField}>
      <Label htmlFor={type}>{familyName}</Label>
      <FamilyInput
        type={type}
        miniFamily={miniFamily}
        setMiniFamily={setMiniFamily}
        allMiniAnimals={allMiniAnimals}
        miniAnimalsInUse={miniAnimalsInUse}
      />
    </div>
  );
};
