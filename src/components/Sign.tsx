import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../util/firebase";
import { Container } from "./Container";
import { errMsgs } from "../util/errorMessages";
import { SignForm } from "./SignForm";
import type { LoginSchema } from "./SignForm";

export function Sign() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [fbErr, setFbErr] = useState<string | undefined>(undefined);

  // ログイン処理
  const loginUser = async (data: LoginSchema) => {
    try {
      // console.log(data);
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // ログイン成功
    } catch (err) {
      console.log(err);
      // ログイン失敗
      switch (err.code) {
        case "auth/invalid-email":
          setFbErr(errMsgs.invalidEmail);
          break;
        case "auth/user-disabled":
          setFbErr(errMsgs.accountDisabled);
          break;
        case "auth/user-not-found":
          setFbErr(errMsgs.userNotFound);
          break;
        case "auth/wrong-password":
          setFbErr(errMsgs.wrongPassword);
          break;
        case "auth/invalid-credential":
          setFbErr(errMsgs.invalidCredential);
          break;
        default:
          // 予備
          setFbErr(errMsgs.unKnownError);
          break;
      }
    }
  };

  // 新規ユーザー作成処理
  const createUser = async (data: LoginSchema) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // Signed in
      const user = userCredential.user;
      // ...
    } catch (err) {
      // 新規ユーザー作成失敗
      // console.log(err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setFbErr(errMsgs.usedEmail);
          break;
        case "auth/invalid-email":
          setFbErr(errMsgs.invalidEmail);
          break;
        case "auth/operation-not-allowed":
          setFbErr(errMsgs.accountDisabled);
          break;
        case "auth/weak-password":
          setFbErr(errMsgs.weakPassword);
          break;
        default:
          // 予備
          setFbErr(errMsgs.unKnownError);
          break;
      }
    }
  };

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="px-4 sm:px-12 py-4 sm:py-20 bg-white lg:border grid gap-y-4">
        <h1>Animals manager</h1>
        <h2 className="text-lg font-bold">
          {isSignIn ? "ログイン" : "新規登録"}
        </h2>
        {/* FBエラーメッセージ */}
        {fbErr && (
          <div className="p-2 text-sm text-red-500 bg-red-50 border  border-red-500">
            {fbErr}
          </div>
        )}
        {/* フォーム */}
        <SignForm onSubmit={isSignIn ? loginUser : createUser} isSignIn={isSignIn} />
        <div className="border-t"></div>
        {/* 新規登録, ログイン切り替えボタン */}
        <button
          onClick={() => setIsSignIn((prev) => !prev)}
          className="w-fit text-slate-500 mx-auto"
        >
          {isSignIn ? "新規登録" : "ログイン"}はこちら
        </button>
      </div>
    </Container>
  );
}
