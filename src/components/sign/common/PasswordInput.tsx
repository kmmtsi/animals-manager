import { Label } from "../../elements/Label";
import { Input } from "../../elements/Input";
import { InputGroup } from "../../generalUI/InputGroup";
import { useState } from "react";
import { CheckboxGroup } from "../../generalUI/CheckboxGroup";

export const PasswordInput = ({
  password,
  setPassword,
  autoComplete,
}: {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  autoComplete: "current-password" | "new-password";
}) => {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  return (
    <div className="grid gap-y-2">
      <InputGroup>
        <Label htmlFor="password" required={true}>
          Password
        </Label>
        <Input
          id="password"
          // 恐らくtype属性はパスワードの目視を防ぐもので、ブラウザの自動保存とは関係が無いと思われる
          type={isPasswordShown ? "text" : "password"} // トグル
          autoComplete={autoComplete}
          placeholder="Password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputGroup>
      {/* パスワード表示用チェックボックス */}
      <CheckboxGroup>
        <Input
          id="showPassword"
          type="checkbox"
          value={isPasswordShown}
          onChange={(e) => setIsPasswordShown(e.target.checked)}
        />
        <Label htmlFor="showPassword">パスワードを表示する</Label>
      </CheckboxGroup>
    </div>
  );
};
