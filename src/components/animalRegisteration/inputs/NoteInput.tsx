import { InputGroup } from "../../generalUI/InputGroup";
import { Label } from "../../elements/Label";
import { Textarea } from "../../elements/Textarea";
import { useState } from "react";

export const NoteInput = () => {
  const [note, setNote] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="note">メモ</Label>
      <Textarea
        id="note"
        placeholder="この動物についてメモしておきたいことを自由に記入しましょう"
        rows={8}
        maxLength={500}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </InputGroup>
  );
};
