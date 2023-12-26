import { collection, getDocs } from "firebase/firestore";
import { db } from "../util/firebase";
import useSWRImmutable from "swr/immutable";
import { PageTitle } from "./PageTitle";

type Props = {
  setCurrentComp: (name: string) => void;
};

export const ListAnimal: React.FC<Props> = ({ setCurrentComp }) => {
  const fetcher = async (collectionName: string) => {
    return await getDocs(collection(db, collectionName));
  };
  const {
    data: querySnapshot,
    isLoading,
    error,
  } = useSWRImmutable("animals", fetcher);

  console.log(querySnapshot);
  //   console.log(typeof querySnapshot)
  //   querySnapshot?.forEach((item) => {
  //     console.log(item.data());
  //   });

  const colId = "col-span-4";
  const colNickname = "col-span-4";
  const colSex = "col-span-2";

  return (
    <>
      <PageTitle tag="h1">動物一覧</PageTitle>
      {querySnapshot && (
        <div className="flex flex-col gap-y-1">
          {/* 行ヘッダー */}
          <div className="grid grid-cols-12 gap-x-2 px-2 text-sm font-medium">
            <div className={colId}>ID</div>
            <div className={colNickname}>ニックネーム</div>
            <div className={colSex}>性別</div>
          </div>
          {/* 各アイテム */}
          {querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return (
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-x-2 border px-2 py-4"
              >
                <div className={colId}>
                  <button onClick={() => setCurrentComp("single")}>
                    {data.id}
                  </button>
                </div>
                <div className={colNickname}>{data.nickname}</div>
                <div className={colSex}>{data.sex}</div>
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
