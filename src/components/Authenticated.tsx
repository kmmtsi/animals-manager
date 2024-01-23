import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { User } from "firebase/auth";
import { useState } from "react";
import { Account } from "./Account";
import { Header } from "./generalUI/Header";
import { Sidebar } from "./generalUI/Sidebar";
import { Alert } from "./generalUI/Alert";
import { Container } from "./generalUI/Container";
import { AnimalRegisteration } from "./animalRegisteration/AnimalRegisteration";
import { ListAnimal } from "./ListAnimal";
import { SingleAnimal } from "./SingleAnimal";
import useSWRImmutable from "swr/immutable";
import { errMsgs } from "../utils/errorMessages";

export const Authenticated = ({ user }: { user: User }) => {
  // 現在表示中のコンポーネント
  const [currentComp, setCurrentComp] = useState("list");

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
            <div className="bg-slate-50 text-slate-900">
              <Header />
              <Container className="grid grid-cols-12">
                <Sidebar
                  currentComp={currentComp}
                  setCurrentComp={setCurrentComp}
                />
                {/* メインエリア */}
                <main className="col-span-10 pl-2 py-4">
                  <div className="bg-white rounded px-4 py-4">
                    {currentComp === "list" && (
                      <ListAnimal setCurrentComp={setCurrentComp} user={user} />
                    )}
                    {currentComp === "add" && (
                      <AnimalRegisteration user={user} />
                    )}
                    {currentComp === "single" && <SingleAnimal />}
                    {currentComp === "account" && <Account />}
                  </div>
                </main>
              </Container>
            </div>
          ) : (
            // userのdocument取得できない場合
            // users collectionへのuser追加エラー発生時
            // この場合コンテンツは一切表示しない
            <Alert role="error">{errMsgs.userNotCreated}</Alert>
          )}
        </>
      )}
      {/* その他のエラー */}
      {error && <div>{error.message}</div>}
    </>
  );
};
