import { Label } from "../generalUI/form/Label";
import { Checkbox } from "../generalUI/form/Checkbox";

export const ShowPasswordInput = ({
  isPwShown,
  setIsPwShown,
}: {
  isPwShown: boolean;
  setIsPwShown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex gap-x-1 items-center">
      <Checkbox
        id="showPassword"
        value="isPwShown"
        checked={isPwShown}
        onChange={(e) => setIsPwShown(e.target.checked)}
      />
      <Label htmlFor="showPassword">パスワードを表示する</Label>
    </div>
  );
};
