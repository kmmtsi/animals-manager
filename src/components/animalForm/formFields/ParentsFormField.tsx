import { FormField } from "../../generalUI/form/FormField";
import { Label } from "../../generalUI/form/Label";
import {
  maxParents,
  maxLengthForAnimalName,
  Parent,
  BaseAnimal,
} from "../../../utils/animal/definitions";
import { ComboBox } from "../comboBox/ComboBox";
import { Dispatch, SetStateAction } from "react";
import { ValidationErrMsgs } from "../../generalUI/form/ValidationErrMsgs";

export const ParentsFormField = ({
  selectedItems,
  setSelectedItems,
  originalItems,
  ngItems,
  validationErrMsgs,
}: {
  selectedItems: Parent[];
  setSelectedItems: Dispatch<SetStateAction<Parent[]>>;
  originalItems: BaseAnimal[];
  ngItems: BaseAnimal[];
  validationErrMsgs: string[];
}) => {
  return (
    <FormField>
      <Label htmlFor="parents">親</Label>
      <ComboBox
        id="parents"
        placeholder="親"
        btnText="リストから選択するか新しく登録します"
        maxLength={maxLengthForAnimalName}
        originalItems={originalItems}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        maxSelect={maxParents}
        ngItems={ngItems}
      />
      <ValidationErrMsgs msgs={validationErrMsgs} />
    </FormField>
  );
};
