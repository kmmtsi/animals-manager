import { InputGroup } from "../../generalUI/InputGroup";
import { Label } from "../../elements/Label";
import { Select } from "../../elements/Select";
// import { useState } from "react";

export const SexInput = () => {
  // const [sex, setSex] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="sex">性別</Label>
      <Select id="sex">
        <option value="">--選択する--</option>
        <option value="オス">オス</option>
        <option value="恐らくオス">恐らくオス</option>
        <option value="メス">メス</option>
        <option value="恐らくメス">恐らくメス</option>
        <option value="不明">不明</option>
        <option value="どちらでもない">どちらでもない</option>
      </Select>
    </InputGroup>
  );
};
