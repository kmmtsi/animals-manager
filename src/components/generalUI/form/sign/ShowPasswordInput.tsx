import { Input } from "../Input";
import { Label } from "../Label";

export const ShowPasswordInput = ({
  isPwShown,
  setIsPwShown,
}: {
  isPwShown: boolean;
  setIsPwShown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center">
      <Input
        id="showPassword"
        type="checkbox"
        value="isPwShown"
        checked={isPwShown}
        onChange={(e) => setIsPwShown(e.target.checked)}
      />
      <Label htmlFor="showPassword">パスワードを表示する</Label>
    </div>
  );
};
