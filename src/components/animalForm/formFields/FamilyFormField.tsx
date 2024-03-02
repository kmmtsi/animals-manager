import { FormField } from "../../generalUI/form/FormField";
import { Label } from "../../generalUI/form/Label";
import { MiniAnimal, familyMapping } from "../../../utils/animal/definitions";
import { FamilyInput } from "../comboBox/FamilyInput";
import { Dispatch, SetStateAction } from "react";

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
    <FormField>
      <Label htmlFor={type}>{familyName}</Label>
      <FamilyInput
        type={type}
        miniFamily={miniFamily}
        setMiniFamily={setMiniFamily}
        allMiniAnimals={allMiniAnimals}
        miniAnimalsInUse={miniAnimalsInUse}
      />
    </FormField>
  );
};
