import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import useSWRImmutable from "swr/immutable";
import { db } from "../../utils/firebase";
import { Msg } from "../generalUI/Msg";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";

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
              <Footer />
            </div>
          ) : (
            // userのdocument取得できない場合
            // users collectionへのuser追加エラー発生時
            // この場合コンテンツは一切表示しない
            <Msg role="err">不明なエラーが発生しました</Msg>
          )}
        </>
      )}
      {/* その他のエラー */}
      {error && <div>{error.message}</div>}
    </>
  );
};
