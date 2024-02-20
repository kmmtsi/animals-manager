import { Label } from "../Label";
import { Input } from "../Input";
import { FormField } from "../FormField";
import { useState } from "react";

export const EmailInput = () => {
  const [email, setEmail] = useState<string>("");

  return (
    <FormField>
      <Label htmlFor="email" required={true}>
        Email
      </Label>
      <Input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="Email"
        required={true}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormField>
  );
};
