import { InputGroup } from "../../generalUI/InputGroup";
import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { useState } from "react";

export const MotherInput = () => {
  const [mother, setMother] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="mother">母親</Label>
      <Input
        id="mother"
        placeholder="母親のID"
        maxLength={30}
        value={mother}
        onChange={(e) => setMother(e.target.value)}
      ></Input>
    </InputGroup>
  );
};
