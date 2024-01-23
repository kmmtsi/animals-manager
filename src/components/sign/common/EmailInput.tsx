import { Label } from "../../elements/Label";
import { Input } from "../../elements/Input";
import { InputGroup } from "../../generalUI/InputGroup";

export const EmailInput = ({
  email,
  setEmail,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <InputGroup>
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
    </InputGroup>
  );
};
