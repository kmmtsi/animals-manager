import { useState } from "react";
import { Logo } from "../generalUI/logo/Logo";
import { WriteResult } from "../../utils/animal/utils";
import { Msg } from "../generalUI/Msg";
import { Form } from "../generalUI/form/Form";
import { getFirebaseErrMsg, signInUser, signUpUser } from "./utils";
import { FormField } from "../generalUI/form/FormField";
import { Label } from "../generalUI/form/Label";
import { btn, btnBlue, checkBox, textInput } from "../../utils/css";
import { FirebaseError } from "firebase/app";

export const Sign = ({ isDefaultSignIn }: { isDefaultSignIn: boolean }) => {
  const [isSignIn, setIsSignIn] = useState<boolean>(isDefaultSignIn);
  const [isPwShown, setIsPwShown] = useState<boolean>(false);
  const signText = isSignIn ? "ログイン" : "新規登録";

  // リクエスト結果
  const [result, setResult] = useState<WriteResult | null>(null);

  return (
    // max-widthを指定しているのでcontainer不要
    <div className="flex flex-col items-center justify-center gap-y-6 mx-auto pt-12 px-2 max-w-80">
      <div className="flex flex-col items-center gap-y-2">
        <Logo isLink={false} />
        <h2 className="font-bold">{signText}</h2>
      </div>
      {/* エラーメッセージ */}
      {result?.status === "err" && (
        <Msg role="err" className="w-full">
          {result.msgs.map((msg) => msg)}
        </Msg>
      )}
      {/* フォーム */}
      <div className="w-full border rounded p-6">
        <Form
          operation={async (data) => {
            // 前回の結果をリセット
            setResult(null);
            try {
              // ログインまたは新規登録処理
              isSignIn ? await signInUser(data) : await signUpUser(data);
            } catch (err) {
              if (err instanceof FirebaseError) {
                // Firebase関連のエラー
                setResult({ status: "err", msgs: [getFirebaseErrMsg(err)] });
              } else {
                // 謎のエラー
                setResult({
                  status: "err",
                  msgs: ["不明なエラーが発生しました"],
                });
              }
            }
          }}
        >
          {/* Email */}
          <FormField>
            <Label htmlFor="email" required={true}>
              Email
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
          </FormField>
          {/* Password */}
          <FormField>
            <Label htmlFor="password" required={true}>
              Password
            </Label>
            <input
              id="password"
              name="password"
              type={isPwShown ? "text" : "password"} // 自動保存とは関係なし
              autoComplete={isSignIn ? "current-password" : "new-password"}
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
              <Label htmlFor="showPassword">パスワードを表示する</Label>
            </div>
          </FormField>
          {/* 送信ボタン */}
          <button type="submit" className={`${btn} ${btnBlue}`}>
            {signText}
          </button>
        </Form>
      </div>
      {/* 新規登録, ログイン切り替えボタン */}
      <button
        onClick={() => {
          setIsSignIn((prev) => !prev);
          // 前回の結果をリセット
          setResult(null);
        }}
        className="w-fit text-slate-500 mx-auto"
      >
        {isSignIn ? "新規登録" : "ログイン"}はこちら
      </button>
    </div>
  );
};
