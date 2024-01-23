import { InputGroup } from "../../generalUI/InputGroup";
import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { useState } from "react";

export const NicknameInput = () => {
  const [nickname, setNickname] = useState<string>("");

  return (
    <InputGroup>
      <Label htmlFor="nickname">ニックネーム</Label>
      <Input
        id="nickname"
        placeholder="ニックネーム"
        maxLength={30}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      ></Input>
    </InputGroup>
  );
};
