import { FormField } from "../../generalUI/form/FormField";
import { Label } from "../../generalUI/form/Label";
import { Textarea } from "../../generalUI/form/Textarea";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { maxLengthForNote } from "../../../utils/animal/definitions";
import { Dispatch, SetStateAction } from "react";

export const NoteFormField = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <FormField>
      <Label htmlFor="note">メモ</Label>
      <Textarea
        id="note"
        placeholder="この動物についてメモしておきたいことを自由に記入しましょう"
        rows={8}
        maxLength={maxLengthForNote}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <TextLengthIndicator
        currentLength={value.length}
        maxLength={maxLengthForNote}
      />
    </FormField>
  );
};
