import { Label } from "../Label";
import { Input } from "../Input";
import { FormField } from "../FormField";
import { useState } from "react";
import { ShowPasswordInput } from "./ShowPasswordInput";

export const PasswordInput = ({
  autoComplete,
}: {
  autoComplete: "current-password" | "new-password";
}) => {
  const [pw, setPw] = useState<string>("");
  const [isPwShown, setIsPwShown] = useState<boolean>(false);

  return (
    <FormField>
      <Label htmlFor="password" required={true}>
        Password
      </Label>
      <Input
        id="password"
        type={isPwShown ? "text" : "password"} // 自動保存とは関係なし
        autoComplete={autoComplete}
        placeholder="Password"
        required={true}
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <ShowPasswordInput isPwShown={isPwShown} setIsPwShown={setIsPwShown} />
    </FormField>
  );
};
