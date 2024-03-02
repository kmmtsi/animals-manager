import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { useState } from "react";
import { PasswordInput } from "../PasswordInput";
import { EmailInput } from "../EmailInput";
import { Form } from "../../generalUI/form/Form";
import { MsgOnSignIn } from "./MsgOnSignIn";
import { btn, btnBlue } from "../../../utils/css";

export const SignIn = () => {
  const [signInStatus, setSignInStatus] = useState<
    AuthError | null | undefined
  >(undefined);

  const loginUser = async (data: { [k: string]: FormDataEntryValue }) => {
    setSignInStatus(null); // 一度リセットしてLoadingを表示
    const { email, password } = data;
    /* ログイン処理 */
    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      // ログイン成功
    } catch (err) {
      // ログイン失敗
      setSignInStatus(err as AuthError);
    }
  };
  return (
    <>
      <h2 className="text-lg font-bold">ログイン</h2>
      <MsgOnSignIn status={signInStatus} />
      {/* フォーム */}
      <Form operation={loginUser}>
        <EmailInput />
        <PasswordInput autoComplete="current-password" />
        <button type="submit" className={`${btn} ${btnBlue}`}>
          ログイン
        </button>
      </Form>
    </>
  );
};
