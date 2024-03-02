import { AuthError } from "firebase/auth";
import { Msg } from "../../generalUI/Msg";
import { LoadingIndicator } from "../../generalUI/LoadingIndicator";

export const MsgOnSignUp = ({
  status,
}: {
  status: AuthError | null | undefined;
}) => {
  let errMsg;
  if (status) {
    const err = status;
    switch (err.code) {
      case "auth/email-already-in-use":
        errMsg = "メールアドレスが既に使用されています";
        break;
      case "auth/invalid-email":
        errMsg = "無効なメールアドレスです";
        break;
      case "auth/operation-not-allowed":
        errMsg = "操作が許可されていません";
        break;
      case "auth/weak-password":
        errMsg = "より複雑なパスワードを設定してください";
        break;
      default:
        // 予備
        errMsg = "エラーが発生しました";
        break;
    }
  }

  return (
    <>
      {status === null && <LoadingIndicator />}
      {errMsg && <Msg role="err">{errMsg}</Msg>}
    </>
  );
};
