import { InputGroup } from "../../generalUI/InputGroup";
import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { useState } from "react";

export const IdInput = () => {
  const [id, setId] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="id" required={true}>
        ID
      </Label>
      <Input
        id="id"
        placeholder="ID"
        required={true}
        maxLength={30}
        autoFocus={true}
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
    </InputGroup>
  );
};
