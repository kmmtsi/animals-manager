import { useOutletContext, useParams } from "react-router-dom";
import { getLocalDateString, useFetchDocs } from "../../utils/common/utils";
import { Pair } from "../../utils/common/definitions";
import { User } from "firebase/auth";
import { getPairById } from "../../utils/pair/utils";
import { fieldGapY, inputBox, pageGapY, pageTitle } from "../../utils/css";
import { useState } from "react";
import { PairUI } from "../generalUI/PairUI";
import { PairForm } from "../pairForm/PairForm";
import { Children } from "../generalUI/Children";

export const PairPage = () => {
  const user = useOutletContext<User>();
  const { pairId } = useParams();

  const { data: allPairs } = useFetchDocs<Pair>(user.uid, "pairs");

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const pair = allPairs && pairId && getPairById(pairId, allPairs);

  return (
    <>
      {pair && (
        <div className={pageGapY}>
          <h1 className={pageTitle}>
            <PairUI pairId={pair.id} pairedAnimals={pair.pairedAnimals} />
          </h1>
          <button
            type="button"
            className="border rounded p-2"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            {isEdit ? "編集をキャンセル" : "編集する"}
          </button>
          {isEdit ? (
            <PairForm prevPair={pair} />
          ) : (
            <div className="space-y-5">
              {/* ペア */}
              <div className={fieldGapY}>
                <div>ペア</div>
                <div className={inputBox}>
                  <PairUI pairId={pair.id} pairedAnimals={pair.pairedAnimals} isAnimalLink={true} />
                </div>
              </div>
              {/* 子 */}
              <div className={fieldGapY}>
                <div>子</div>
                <div className={inputBox}>
                  {pair.children.length > 0 ? (
                    <Children children={pair.children} />
                  ) : (
                    "データがありません"
                  )}
                </div>
              </div>
              {/* 作成日 */}
              <div className={fieldGapY}>
                <div>作成日</div>
                <div>{getLocalDateString(pair.createdAt)}</div>
              </div>
              {/* 作成者 */}
              <div className={fieldGapY}>
                <div>作成したユーザー</div>
                <div>{pair.createdBy}</div>
              </div>
              {/* 更新日 */}
              <div className={fieldGapY}>
                <div>更新日</div>
                <div>{getLocalDateString(pair.updatedAt)}</div>
              </div>
              {/* 更新者 */}
              <div className={fieldGapY}>
                <div>更新したユーザー</div>
                <div>{pair.updatedBy}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
