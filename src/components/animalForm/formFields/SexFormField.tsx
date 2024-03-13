import { Label } from "../../generalUI/form/Label";
import { sexOptions } from "../../../utils/common/definitions";
import { Sex } from "../../../utils/common/definitions";
import { Dispatch, SetStateAction } from "react";
import { formField, select } from "../../../utils/css";

export const SexFormField = ({
  value,
  setValue,
}: {
  value: Sex;
  setValue: Dispatch<SetStateAction<Sex>>;
}) => {
  return (
    <div className={formField}>
      <Label htmlFor="sex">性別</Label>
      <select
        id="sex"
        name="sex"
        value={value}
        className={select}
        onChange={(e) => {
          setValue(e.target.value as Sex);
        }}
      >
        {sexOptions.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
