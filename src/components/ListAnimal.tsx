import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import useSWR from "swr";
// import useSWRImmutable from "swr/immutable";
import { PageTitle } from "./generalUI/PageTitle";
import { User } from "firebase/auth";

export const ListAnimal = ({
  setCurrentComp,
  user,
}: {
  setCurrentComp: (name: string) => void;
  user: User;
}) => {
  /* animalsサブコレクションを取得 */
  const {
    data: querySnapshot,
    isLoading,
    error,
  } = useSWR("animals", async (subCollection: string) => {
    return await getDocs(collection(db, "users", user.uid, subCollection));
  });

  // console.log(querySnapshot);

  return (
    <>
      <PageTitle tag="h1">動物一覧</PageTitle>
      {querySnapshot && (
        <div className="flex flex-col gap-y-1">
          {/* 行ヘッダー */}
          <div className="grid grid-cols-12 gap-x-2 px-2 text-sm font-medium">
            <div className="col-span-4">ID</div>
            <div className="col-span-4">ニックネーム</div>
            <div className="col-span-2">性別</div>
          </div>
          {/* 各アイテム */}
          {querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return (
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-x-2 border px-2 py-4"
              >
                <div className="col-span-4">
                  <button onClick={() => setCurrentComp("single")}>
                    {data.id}
                  </button>
                </div>
                <div className="col-span-4">{data.nickname}</div>
                <div className="col-span-2">{data.sex}</div>
              </div>
            );
          })}
        </div>
      )}
      {isLoading && <div>Loading</div>}
      {error && <div>{error.message}</div>}
    </>
  );
};
