import { AuthError } from "firebase/auth";
import { Alert } from "../../generalUI/Alert";
import { LoadingIndicator } from "../../generalUI/LoadingIndicator";

export const MsgOnSignIn = ({
  status,
}: {
  status: AuthError | null | undefined;
}) => {
  let errMsg;
  if (status) {
    const err = status;
    switch (err.code) {
      case "auth/invalid-email":
        errMsg = "無効なメールアドレスです";
        break;
      case "auth/user-disabled":
        errMsg = "このアカウントは使用できません";
        break;
      case "auth/user-not-found":
        errMsg = "ユーザーが見つかりません";
        break;
      case "auth/wrong-password":
        errMsg = "パスワードが間違っています";
        break;
      case "auth/invalid-credential":
        errMsg = "ログイン情報に誤りがあります";
        break;
      // 予備
      default:
        errMsg = "エラーが発生しました";
        break;
    }
  }

  return (
    <>
      {status === null && <LoadingIndicator />}
      {errMsg && <Alert role="err">{errMsg}</Alert>}
    </>
  );
};
