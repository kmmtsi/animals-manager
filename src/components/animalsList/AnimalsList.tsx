import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { Animal } from "../../utils/animal/definitions";
import { useFetchAnimals } from "../../utils/animal/fetch";
import {
  WriteResult,
  convertAnimalsToMinis,
  getLocalDateString,
  getWriteErrMsgs,
} from "../../utils/animal/utils";
import { deleteAnimals } from "../../utils/animal/deleteAnimals";
import { ClickableIcon } from "../generalUI/ClickableIcon";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import { Msg } from "../generalUI/Msg";
import { PageTitle } from "../generalUI/PageTitle";
import { Checkbox } from "../generalUI/form/Checkbox";
import { FamilyTd } from "./FamilyTd";
import { NameAndSex } from "./NameAndSex";
import { Td } from "./Td";
import { Th } from "./Th";
import { getSortedAnimals } from "./utils";

export const AnimalsList = () => {
  const user = useOutletContext<User>();

  // animalsを取得
  const { data: animals, mutate, isLoading, error } = useFetchAnimals(user.uid);

  // ソートの準備
  const [sortMethod, setSortMethod] = useState<{
    target: "name" | "createdAt" | "updatedAt";
    method: "asc" | "desc";
  }>({
    // ソートのデフォルト値
    target: "createdAt",
    method: "desc",
  });

  // ソートされたanimalsを取得
  const sortedAnimals = animals
    ? getSortedAnimals(animals, sortMethod.target, sortMethod.method)
    : [];

  // checkboxによる選択状況
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  // AnimalPageでの動物削除後の遷移時に保持させた書き込み結果
  const deleteResultFromAnimalPage: null | WriteResult = useLocation().state;

  // 書き込み結果
  const [writeResult, setWriteResult] = useState<WriteResult | undefined>(
    deleteResultFromAnimalPage || undefined
  );

  // miniAnimalsを取得
  const allMiniAnimals = convertAnimalsToMinis(animals || []);

  return (
    <div className="grid gap-y-6">
      <PageTitle tag="h1">動物一覧</PageTitle>
      {animals && (
        <div className="grid gap-y-4">
          {writeResult && (
            // 削除結果を表示
            <Msg role={writeResult.status}>
              {writeResult.msgs.map((msg, i) => (
                <div key={i} className="py-px">
                  {msg}
                </div>
              ))}
            </Msg>
          )}
          {animals.length > 0 ? (
            // DBから1つ以上のデータ取得済みの場合
            <div className="overflow-x-auto">
              {/* tableのプチメニュー */}
              <div className="flex items-center justify-between gap-x-2 p-3 border-t border-x rounded-t bg-slate-50">
                {selectedAnimals.length > 0 && (
                  // 選択済みのアイテムがある場合表示
                  <div className="flex gap-x-2">
                    <div>{selectedAnimals.length}件選択済み</div>
                    <div>
                      <ClickableIcon
                        icon={faTrashCan}
                        onClick={async () => {
                          // 削除してよいか確認
                          const result =
                            confirm(`選択済みの動物を削除しますか？`);
                          if (result) {
                            // 削除処理
                            try {
                              const result = await deleteAnimals(
                                selectedAnimals,
                                user.uid,
                                animals,
                                mutate
                              );
                              setWriteResult(result);
                              // 動物の選択状況をリセット
                              setSelectedAnimals([]);
                            } catch (err) {
                              setWriteResult({
                                status: "err",
                                msgs: getWriteErrMsgs(err),
                              });
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* フィルター状況 */}
                <div className="flex items-center justify-center text-xs text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-full">
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
              </div>
              {/* テーブル */}
              <table className="border-collapse text-start w-full">
                {/* 行ヘッダー */}
                <thead>
                  <tr>
                    <Th className="w-fit">
                      <Checkbox
                        onChange={(e) => {
                          if (e.target.checked) {
                            // チェックされたとき
                            setSelectedAnimals(animals);
                          } else {
                            // チェックが外されたとき
                            setSelectedAnimals([]);
                          }
                        }}
                        className="size-3.5"
                      />
                    </Th>
                    <Th
                      sortTarget="name"
                      setSortMethod={setSortMethod}
                      className="min-w-36"
                    >
                      名前
                    </Th>
                    <Th className="min-w-36">親</Th>
                    <Th className="min-w-36">子ども</Th>
                    <Th>メモ</Th>
                    <Th
                      sortTarget="createdAt"
                      setSortMethod={setSortMethod}
                      className="min-w-20 max-w-24"
                    >
                      登録日
                    </Th>
                    <Th
                      sortTarget="updatedAt"
                      setSortMethod={setSortMethod}
                      className="min-w-20 max-w-24"
                    >
                      更新日
                    </Th>
                  </tr>
                </thead>
                {/* データ内容 */}
                <tbody className="cursor-default">
                  {sortedAnimals.map((animal, index) => {
                    return (
                      // 各行
                      <tr key={index}>
                        {/* チェックボックス */}
                        <Td>
                          <Checkbox
                            checked={selectedAnimals.includes(animal)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // チェックされたとき
                                setSelectedAnimals([
                                  ...selectedAnimals,
                                  animal,
                                ]);
                              } else {
                                // チェックが外されたとき
                                setSelectedAnimals(
                                  selectedAnimals.filter(
                                    (selectedAnimal) =>
                                      selectedAnimal !== animal
                                  )
                                );
                              }
                            }}
                            className="size-3.5"
                          />
                        </Td>
                        {/* 名前 */}
                        <Td className={`font-medium`}>
                          <NameAndSex animal={animal} isLink={true} />
                        </Td>
                        {/* 親 */}
                        <FamilyTd
                          family={animal.parents}
                          allMiniAnimals={allMiniAnimals}
                        />
                        {/* 子ども */}
                        <FamilyTd
                          family={animal.children}
                          allMiniAnimals={allMiniAnimals}
                        />
                        {/* メモ */}
                        <Td>{animal.note}</Td>
                        {/* 登録日 */}
                        <Td>{getLocalDateString(animal.createdAt)}</Td>
                        {/* 更新日 */}
                        <Td>{getLocalDateString(animal.updatedAt)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-y-3">
              <div>動物が登録されていません</div>
              <Link
                to="/create"
                className="px-2 py-4 border border-blue-100 rounded block bg-blue-50 text-blue-500"
              >
                動物を登録する
              </Link>
            </div>
          )}
        </div>
      )}
      {isLoading && <LoadingIndicator />}
      {error && (
        <div>
          <Msg role="err">{error.message}</Msg>
        </div>
      )}
    </div>
  );
};
