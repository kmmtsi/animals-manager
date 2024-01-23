import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { auth } from "../../../utils/firebase";
import { Alert } from "../../generalUI/Alert";
import { useState } from "react";
import { Btn } from "../../elements/Btn";
import { errMsgs } from "../../../utils/errorMessages";
import { EmailInput } from "../common/EmailInput";
import { PasswordInput } from "../common/PasswordInput";
import { User } from "firebase/auth";
import { Form } from "../../elements/Form";

export const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  /* 新規ユーザー作成処理 */
  const createUser = async (data: { [k: string]: FormDataEntryValue }) => {
    const { email, password } = data;
    /* Firebase authへの新規ユーザー追加処理 */
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      // users collectionへのユーザー追加に移る
      createUserForFirestore(userCredential.user);
    } catch (err) {
      // Firebase authでユーザー作成失敗
      switch (err.code) {
        case "auth/email-already-in-use":
          setErrMsg(errMsgs.usedEmail);
          break;
        case "auth/invalid-email":
          setErrMsg(errMsgs.invalidEmail);
          break;
        case "auth/operation-not-allowed":
          setErrMsg(errMsgs.accountDisabled);
          break;
        case "auth/weak-password":
          setErrMsg(errMsgs.weakPassword);
          break;
        default:
          // 予備
          setErrMsg(errMsgs.unKnownError);
          break;
      }
    }
    /* Firestoreへの新規ユーザー追加処理 */
    async function createUserForFirestore(user: User) {
      try {
        // users collectionに新規userを追加
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          email: user.email,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        // users collectionにuserの追加失敗
        console.error(err);
      }
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold">新規登録</h2>
      {/* Firebase エラーメッセージ */}
      {errMsg && <Alert role="error">{errMsg}</Alert>}
      {/* フォーム */}
      <Form operation={createUser}>
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          autoComplete="new-password"
        />
        <Btn type="submit">新規登録</Btn>
      </Form>
    </>
  );
};
