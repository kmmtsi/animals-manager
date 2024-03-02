import { Label } from "../generalUI/form/Label";
import { Input } from "../generalUI/form/Input";
import { FormField } from "../generalUI/form/FormField";
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
