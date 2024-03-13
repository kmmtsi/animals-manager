import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { SortMethod, convertAnimalsToMinis } from "../../utils/animal/utils";
import { convertErrToMsgs } from "../../utils/common/utils";
import { getLocalDateString } from "../../utils/common/utils";
import { Animal, Pair } from "../../utils/common/definitions";
import { WriteResult, useFetchDocs } from "../../utils/common/utils";
import {
  checkBox,
  msgLikeBtn,
  pageTitle,
  table,
  tableCheckBox,
} from "../../utils/css";
import { ClickableIcon } from "../generalUI/ClickableIcon";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import { Msg } from "../generalUI/Msg";
import { NameAndSex } from "../generalUI/NameAndSex";
import { PairTd } from "./FamilyTd";
import { Td } from "./Td";
import { Th } from "./Th";
import { getSortedAnimals } from "../../utils/animal/utils";

export const AnimalsList = () => {
  const user = useOutletContext<User>();

  // animalsを取得
  const {
    data: animalsData,
    mutate: animalsMutator,
    isLoading: isLoadingAnimals,
    error: animalsError,
  } = useFetchDocs<Animal>(user.uid, "animals");

  const {
    data: pairsData,
    mutate: pairsMutator,
    isLoading: isLoadingPairs,
    error: pairsError,
  } = useFetchDocs<Pair>(user.uid, "pairs");

  // ソートの準備
  const [sortMethod, setSortMethod] = useState<SortMethod>({
    target: "createdAt",
    order: "desc",
  });

  // ソートされたanimalsを取得
  const sortedAnimals = animalsData
    ? getSortedAnimals(animalsData, sortMethod)
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
  const allMiniAnimals = convertAnimalsToMinis(animalsData || []);

  return (
    <div className="grid gap-y-6">
      <h1 className={pageTitle}>動物一覧</h1>
      {animalsData && pairsData && (
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
          {animalsData.length > 0 ? (
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
                                animalsData,
                                animalsMutator
                              );
                              setWriteResult(result);
                              // 動物の選択状況をリセット
                              setSelectedAnimals([]);
                            } catch (err) {
                              setWriteResult({
                                status: "err",
                                msgs: convertErrToMsgs(err),
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
                    icon={sortMethod.order === "asc" ? faArrowUp : faArrowDown}
                    className=""
                  />
                </div>
              </div>
              {/* テーブル */}
              <table className={table}>
                {/* 行ヘッダー */}
                <thead>
                  <tr>
                    <Th className="w-9">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            // チェックされたとき
                            setSelectedAnimals(animalsData);
                          } else {
                            // チェックが外されたとき
                            setSelectedAnimals([]);
                          }
                        }}
                        className={tableCheckBox}
                      />
                    </Th>
                    <Th
                      sortTarget="name"
                      setSortMethod={setSortMethod}
                      className="min-w-36"
                    >
                      名前
                    </Th>
                    {/* <Th className="min-w-36">親</Th> */}
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
                          <input
                            type="checkbox"
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
                            className={tableCheckBox}
                          />
                        </Td>
                        {/* 名前 */}
                        <Td>
                          <NameAndSex animal={animal} isLink={true} />
                        </Td>
                        {/* 親 */}
                        {/* <PairTd
                          pairIds={[animal.sourcePair]}
                          field="pairedAnimals"
                          allPairs={pairsData}
                        /> */}
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
              <Link to="/create" className={msgLikeBtn}>
                動物を登録する
              </Link>
            </div>
          )}
        </div>
      )}
      {(isLoadingAnimals || isLoadingPairs) && <LoadingIndicator />}
      {animalsError && (
        <div>
          <Msg role="err">{animalsError.message}</Msg>
        </div>
      )}
      {pairsError && (
        <div>
          <Msg role="err">{pairsError.message}</Msg>
        </div>
      )}
    </div>
  );
};
