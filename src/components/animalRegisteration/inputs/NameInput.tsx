import { InputGroup } from "../../generalUI/InputGroup";
import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { useState } from "react";

export const NameInput = () => {
  const [name, setName] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="name" required={true}>
        名前
      </Label>
      <Input
        id="name"
        placeholder="名前"
        required={true}
        maxLength={30}
        autoFocus={true}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </InputGroup>
  );
};
