import { FormField } from "../../generalUI/form/FormField";
import { Label } from "../../generalUI/form/Label";
import { Select } from "../../generalUI/form/Select";
import { sexOptions } from "../../../utils/animal/definitions";
import { Sex } from "../../../utils/animal/definitions";
import { Dispatch, SetStateAction } from "react";

export const SexFormField = ({
  value,
  setValue,
}: {
  value: Sex;
  setValue: Dispatch<SetStateAction<Sex>>;
}) => {
  return (
    <FormField>
      <Label htmlFor="sex">性別</Label>
      <Select
        id="sex"
        value={value}
        onChange={(e) => {
          setValue(e.target.value as Sex);
        }}
      >
        {sexOptions.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormField>
  );
};
