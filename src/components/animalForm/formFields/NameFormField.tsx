import { FormField } from "../../generalUI/form/FormField";
import { Input } from "../../generalUI/form/Input";
import { Label } from "../../generalUI/form/Label";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { maxLengthForAnimalName } from "../../../utils/animal/definitions";
import { ValidationErrMsgs } from "../../generalUI/form/ValidationErrMsgs";
import { Dispatch, SetStateAction } from "react";

export const NameFormField = ({
  value,
  setValue,
  validationErrMsgs,
  autoFocus,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  validationErrMsgs: string[];
  autoFocus: boolean;
}) => {
  return (
    <FormField>
      <Label htmlFor="name" required={true}>
        名前
      </Label>
      <Input
        id="name"
        placeholder="（必須）一意の動物のID、名称、ニックネームなど"
        required={true}
        maxLength={maxLengthForAnimalName}
        autoFocus={autoFocus} // 新規作成のときのみautoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <ValidationErrMsgs msgs={validationErrMsgs} />
      <TextLengthIndicator
        currentLength={value.length}
        maxLength={maxLengthForAnimalName}
      />
    </FormField>
  );
};
