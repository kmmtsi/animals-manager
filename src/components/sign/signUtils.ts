import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import i18n from "../../i18n/config";
import { auth } from "../../utils/firebase";
import { createUser } from "../../utils/user/createUser";

export const signInUser = async (data: { [k: string]: FormDataEntryValue }) => {
  const { email, password } = data;
  await signInWithEmailAndPassword(auth, email as string, password as string);
};

export const signUpUser = async (data: { [k: string]: FormDataEntryValue }) => {
  const { email, password } = data;

  /* Firebase authへの新規ユーザー追加処理 */
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email as string,
    password as string
  );

  const user = userCredential.user;

  // users collectionに新規userを追加
  await createUser(user.uid, user.email as string);
};

export const getSignErrMsg = (err: unknown) => {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/email-already-in-use":
        return i18n.t("emailAlreadyInUse");
      case "auth/invalid-email":
        return i18n.t("invalidEmail");
      case "auth/operation-not-allowed":
        return i18n.t("operationNotAllowed");
      case "auth/weak-password":
        return i18n.t("weakPassword");
      case "auth/user-disabled":
        return i18n.t("userDisabled");
      case "auth/user-not-found":
        return i18n.t("userNotFound");
      case "auth/wrong-password":
        return i18n.t("wrongPassword");
      case "auth/invalid-credential":
        return i18n.t("invalidCredential");
      default:
        // 予備
        return i18n.t("unknownErr");
    }
  } else {
    return i18n.t("unknownErr");
  }
};
