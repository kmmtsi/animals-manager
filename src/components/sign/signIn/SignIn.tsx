import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../utils/firebase";
import { Alert } from "../../generalUI/Alert";
import { useState } from "react";
import { Btn } from "../../elements/Btn";
import { errMsgs } from "../../../utils/errorMessages";
import { PasswordInput } from "../common/PasswordInput";
import { EmailInput } from "../common/EmailInput";
import { Form } from "../../elements/Form";

export const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const loginUser = async (data: { [k: string]: FormDataEntryValue }) => {
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
      switch (err.code) {
        case "auth/invalid-email":
          setErrMsg(errMsgs.invalidEmail);
          break;
        case "auth/user-disabled":
          setErrMsg(errMsgs.accountDisabled);
          break;
        case "auth/user-not-found":
          setErrMsg(errMsgs.userNotFound);
          break;
        case "auth/wrong-password":
          setErrMsg(errMsgs.wrongPassword);
          break;
        case "auth/invalid-credential":
          setErrMsg(errMsgs.invalidCredential);
          break;
        default:
          // 予備
          setErrMsg(errMsgs.unKnownError);
          break;
      }
    }
  };
  return (
    <>
      <h2 className="text-lg font-bold">ログイン</h2>
      {/* Firebase エラーメッセージ */}
      {errMsg && <Alert role="error">{errMsg}</Alert>}
      {/* フォーム */}
      <Form operation={loginUser}>
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          autoComplete="current-password"
        />
        <Btn type="submit">ログイン</Btn>
      </Form>
    </>
  );
};
