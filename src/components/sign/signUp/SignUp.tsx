import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { auth } from "../../../utils/firebase";
import { useState } from "react";
import { EmailInput } from "../EmailInput";
import { PasswordInput } from "../PasswordInput";
import { User } from "firebase/auth";
import { Form } from "../../generalUI/form/Form";
import { AuthError } from "firebase/auth";
import { MsgOnSignUp } from "./MsgOnSignUp";
import { btn, btnBlue } from "../../../utils/css";

export const SignUp = () => {
  const [signUpStatus, setSignUpStatus] = useState<
    AuthError | null | undefined
  >(undefined);

  /* 新規ユーザー作成処理 */
  const createUser = async (data: { [k: string]: FormDataEntryValue }) => {
    setSignUpStatus(null);
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
      setSignUpStatus(err as AuthError);
    }

    /* Firestoreへの新規ユーザー追加処理 */
    async function createUserForFirestore(user: User) {
      try {
        // users collectionに新規userを追加
        await setDoc(doc(db, "users", user.uid), {
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
      <MsgOnSignUp status={signUpStatus} />
      {/* フォーム */}
      <Form operation={createUser}>
        <EmailInput />
        <PasswordInput autoComplete="new-password" />
        <button type="submit" className={`${btn} ${btnBlue}`}>
          新規登録
        </button>
      </Form>
    </>
  );
};
