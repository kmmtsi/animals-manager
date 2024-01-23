import { InputGroup } from "../../generalUI/InputGroup";
import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { useState } from "react";

export const FatherInput = () => {
  const [father, setFather] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="father">父親</Label>
      <Input
        id="father"
        placeholder="父親のID"
        maxLength={30}
        value={father}
        onChange={(e) => setFather(e.target.value)}
      ></Input>
    </InputGroup>
  );
};
