import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { User } from "firebase/auth";
import { Header } from "./Header";
import { Alert } from "../generalUI/Alert";
import { Body } from "./Body";
import useSWRImmutable from "swr/immutable";
import { errMsgs } from "../../utils/errorMessages";

export const AuthenticatedView = ({ user }: { user: User }) => {
  // users collectionから当該userのdocumentを取得
  const { data: docSnap, error } = useSWRImmutable(user.uid, async (userID) => {
    const docRef = doc(db, "users", userID);
    return await getDoc(docRef);
  });

  return (
    <>
      {docSnap && (
        <>
          {/* userがusers collectionに正しく追加されているかを確認する */}
          {docSnap.exists() ? (
            // userのdocument取得成功
            <div>
              <Header />
              <Body user={user} />
            </div>
          ) : (
            // userのdocument取得できない場合
            // users collectionへのuser追加エラー発生時
            // この場合コンテンツは一切表示しない
            <Alert role="err">{errMsgs.userNotCreated}</Alert>
          )}
        </>
      )}
      {/* その他のエラー */}
      {error && <div>{error.message}</div>}
    </>
  );
};
