import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getTimestamp } from "../../utils/common/utils";
import { FirebaseError } from "firebase/app";

/**
 * ログイン処理
 * @param data
 */
export const signInUser = async (data: { [k: string]: FormDataEntryValue }) => {
  const { email, password } = data;
  await signInWithEmailAndPassword(auth, email as string, password as string);
};

/**
 * 新規登録処理
 * @param data
 */
export const signUpUser = async (data: { [k: string]: FormDataEntryValue }) => {
  const { email, password } = data;

  /* Firebase authへの新規ユーザー追加処理 */
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email as string,
    password as string
  );

  const user = userCredential.user;

  /// users collectionに新規userを追加
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: getTimestamp(),
  });
};

export const getFirebaseErrMsg = (err: FirebaseError) => {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "メールアドレスが既に使用されています";
    case "auth/invalid-email":
      return "無効なメールアドレスです";
    case "auth/operation-not-allowed":
      return "操作が許可されていません";
    case "auth/weak-password":
      return "より複雑なパスワードを設定してください";
    case "auth/user-disabled":
      return "このアカウントは使用できません";
    case "auth/user-not-found":
      return "ユーザーが見つかりません";
    case "auth/wrong-password":
      return "パスワードが間違っています";
    case "auth/invalid-credential":
      return "ログイン情報に誤りがあります";
    default:
      // 予備
      return "不明なエラーが発生しました";
  }
};
