import { FormField } from "../../generalUI/form/FormField";
import { Label } from "../../generalUI/form/Label";
import {
  BaseAnimal,
  Child,
  maxChildren,
  maxLengthForAnimalName,
} from "../../../utils/animal/definitions";
import { ComboBox } from "../comboBox/ComboBox";
import { Dispatch, SetStateAction } from "react";
import { ValidationErrMsgs } from "../../generalUI/form/ValidationErrMsgs";

export const ChildrenFormField = ({
  selectedItems,
  setSelectedItems,
  originalItems,
  ngItems,
  validationErrMsgs,
}: {
  selectedItems: Child[];
  setSelectedItems: Dispatch<SetStateAction<Child[]>>;
  originalItems: BaseAnimal[];
  ngItems: BaseAnimal[];
  validationErrMsgs: string[];
}) => {
  return (
    <FormField>
      <Label htmlFor="children">子ども</Label>
      <ComboBox
        id="children"
        placeholder="子ども"
        btnText="リストから選択するか新しく登録します"
        maxLength={maxLengthForAnimalName}
        originalItems={originalItems}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        maxSelect={maxChildren}
        ngItems={ngItems}
      />
      <ValidationErrMsgs msgs={validationErrMsgs} />
    </FormField>
  );
};
