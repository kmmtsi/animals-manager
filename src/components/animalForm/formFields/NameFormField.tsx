import { FormField } from "../../generalUI/form/FormField";
import { Label } from "../../generalUI/form/Label";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { maxAnimalName } from "../../../utils/animal/definitions";
import { Dispatch, SetStateAction } from "react";
import { textInput } from "../../../utils/css";

export const NameFormField = ({
  value,
  setValue,
  autoFocus,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  autoFocus: boolean;
}) => {
  return (
    <FormField>
      <Label htmlFor="name" required={true}>
        名前
      </Label>
      <input
        id="name"
        name="name"
        placeholder="（必須）一意の動物のID、名称、ニックネームなど"
        required={true}
        maxLength={maxAnimalName}
        autoFocus={autoFocus} // 新規作成のときのみautoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={textInput}
      />
      <TextLengthIndicator
        currentLength={value.length}
        maxLength={maxAnimalName}
      />
    </FormField>
  );
};
