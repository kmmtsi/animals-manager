import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  btn,
  btnBlue,
  checkBox,
  formFieldGapY,
  textInput,
} from "../../utils/css";
import { Form } from "../generalUI/form/Form";
import { Label } from "../generalUI/form/Label";

export const SignForm = ({
  btnText,
  pwAutoComplete,
  formOperation,
}: {
  btnText: string;
  pwAutoComplete: "current-password" | "new-password";
  formOperation: (
    data: {
      [k: string]: FormDataEntryValue;
    },
    form: HTMLFormElement
  ) => void;
}) => {
  const { t } = useTranslation();
  const [isPwShown, setIsPwShown] = useState<boolean>(false);

  return (
    <Form operation={formOperation}>
      {/* Email */}
      <div className={formFieldGapY}>
        <Label htmlFor="email" required={true}>
          {t("email")}
        </Label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          required={true}
          className={textInput}
        />
      </div>
      {/* Password */}
      <div className={formFieldGapY}>
        <Label htmlFor="password" required={true}>
          {t("password")}
        </Label>
        <input
          id="password"
          name="password"
          type={isPwShown ? "text" : "password"} // 自動保存とは関係なし
          autoComplete={pwAutoComplete}
          placeholder="Password"
          required={true}
          className={textInput}
        />
        {/* パスワード表示 */}
        <div className="flex gap-x-1 items-center">
          <input
            id="showPassword"
            type="checkbox"
            value="isPwShown"
            checked={isPwShown}
            onChange={(e) => setIsPwShown(e.target.checked)}
            className={checkBox}
          />
          <Label htmlFor="showPassword">{t("showPassword")}</Label>
        </div>
      </div>
      {/* 送信ボタン */}
      <button type="submit" className={`w-full ${btn} ${btnBlue}`}>
        {btnText}
      </button>
    </Form>
  );
};
