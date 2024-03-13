import { Label } from "../../generalUI/form/Label";
import { Textarea } from "../../generalUI/form/Textarea";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { maxNote } from "../../../utils/common/definitions";
import { Dispatch, SetStateAction } from "react";
import { formField } from "../../../utils/css";

export const NoteFormField = ({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className={formField}>
      <Label htmlFor="note">メモ</Label>
      <Textarea
        id="note"
        placeholder="この動物についてメモしておきたいことを自由に記入しましょう"
        rows={8}
        maxLength={maxNote}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <TextLengthIndicator currentLength={value.length} maxLength={maxNote} />
    </div>
  );
};
