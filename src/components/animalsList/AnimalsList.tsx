import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { PageTitle } from "../generalUI/PageTitle";
import { User } from "firebase/auth";
import { useSWRAnimals } from "../../utils/animal/fetch";
import { Td } from "./Td";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import { Th } from "./Th";
import { useState } from "react";
import { getSortedAnimals } from "./utils";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link, useOutletContext } from "react-router-dom";
import { NameAndSexLink } from "./NameAndSexLink";
import { getLocalDateString } from "../../utils/db/utils";
import { deleteAnimals } from "../../utils/animal/write/deleteAnimals";
import { WriteResult } from "../../utils/animal/write/writeAnimals";

export const AnimalsList = () => {
  const user = useOutletContext<User>();

  // animalsを取得
  const { data: animals, mutate, isLoading, error } = useSWRAnimals(user.uid);

  // ソートの準備
  const [sortMethod, setSortMethod] = useState<{
    target: "name" | "createdAt" | "updatedAt";
    method: "asc" | "desc";
  }>({
    target: "updatedAt",
    method: "desc",
  });

  // delete結果
  const [deleteResult, setDeleteResult] = useState<WriteResult | undefined>(
    undefined
  );

  return (
    <div className="grid gap-y-6">
      <PageTitle tag="h1">動物一覧</PageTitle>
      {animals && animals.length > 0 ? (
        // DBから1つ以上のデータ取得済みの場合
        <div className="grid gap-y-2">
          {/* フィルター状況 */}
          <div className="text-xs text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-full">
            <span>並べ替え：</span>
            <span className="mr-1">
              {sortMethod.target === "name"
                ? "名前"
                : sortMethod.target === "createdAt"
                ? "登録日"
                : "更新日"}
            </span>
            <FontAwesomeIcon
              icon={sortMethod.method === "asc" ? faArrowUp : faArrowDown}
              className=""
            />
          </div>
          {/* テーブル */}
          <div className="overflow-x-auto">
            <table className="border-collapse text-sm text-start w-full">
              {/* 行ヘッダー */}
              <thead>
                <tr>
                  <Th
                    name="名前"
                    sortTarget="name"
                    setSortMethod={setSortMethod}
                    className="min-w-36"
                  />
                  <Th name="親" className="min-w-36" />
                  <Th name="子ども" className="min-w-36" />
                  <Th name="メモ" />
                  <Th
                    name="登録日"
                    sortTarget="createdAt"
                    setSortMethod={setSortMethod}
                    className="min-w-20 max-w-24"
                  />
                  <Th
                    name="更新日"
                    sortTarget="updatedAt"
                    setSortMethod={setSortMethod}
                    className="min-w-20 max-w-24"
                  />
                  <Th name="" />
                </tr>
              </thead>
              {/* データ内容 */}
              {/* {querySnapshot.docs.length === 0 && <div>データがありません</div>} */}
              {
                // 以下ソート処理済みのanimalsを表示
                getSortedAnimals(
                  animals,
                  sortMethod.target,
                  sortMethod.method
                ).map((animal, index) => {
                  return (
                    // アイテム（各行）
                    <tbody key={index}>
                      <tr className="cursor-default">
                        {/* 名前 */}
                        <Td className={`font-medium`}>
                          <NameAndSexLink
                            id={animal.id}
                            name={animal.name}
                            sex={animal.sex}
                          />
                        </Td>
                        {/* 親 */}
                        <Td className={``}>
                          {animal.parents.map((parent, i) => (
                            <NameAndSexLink
                              key={i}
                              id={parent.id}
                              name={parent.name}
                              sex={parent.sex}
                            />
                          ))}
                        </Td>
                        {/* 子ども */}
                        <Td className={``}>
                          {animal.children.map((child, i) => (
                            <NameAndSexLink
                              key={i}
                              id={child.id}
                              name={child.name}
                              sex={child.sex}
                            />
                          ))}
                        </Td>
                        {/* メモ */}
                        <Td className={``}>{animal.note}</Td>
                        {/* 登録日 */}
                        <Td className={``}>
                          <time dateTime={animal.createdAt}>
                            {getLocalDateString(animal.createdAt)}
                          </time>
                        </Td>
                        {/* 更新日 */}
                        <Td className={``}>
                          <time dateTime={animal.updatedAt}>
                            {getLocalDateString(animal.updatedAt)}
                          </time>
                        </Td>
                        {/* 削除ボタン */}
                        <Td>
                          <button
                            type="button"
                            onClick={async () => {
                              // 削除してよいか確認
                              const result = confirm(
                                `${animal.name} を削除しますか？`
                              );
                              if (result) {
                                // 削除処理
                                const result = deleteAnimals(
                                  [animal],
                                  user,
                                  animals,
                                  mutate
                                );
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </Td>
                      </tr>
                    </tbody>
                  );
                })
              }
            </table>
          </div>
        </div>
      ) : (
        <div className="text-sm grid gap-y-3">
          <div>動物が登録されていません</div>
          <Link
            to="/create"
            className="px-2 py-4 border border-blue-100 rounded block bg-blue-50 text-blue-500"
          >
            動物を登録する
          </Link>
        </div>
      )}
      {isLoading && <LoadingIndicator />}
      {error && <div>{error.message}</div>}
    </div>
  );
};
