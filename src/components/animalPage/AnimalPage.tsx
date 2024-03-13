import { User } from "firebase/auth";
import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { getAnimalById } from "../../utils/animal/utils";
import { Animal, Pair, sexMapping } from "../../utils/common/definitions";
import { getLocalDateString, useFetchDocs } from "../../utils/common/utils";
import {
  btn,
  btnOutlineRed,
  fieldGapY,
  formGapY,
  hover,
  inputBox,
  msgLikeBtn,
  pageGapY,
  pageTitle,
} from "../../utils/css";
import { getPairById } from "../../utils/pair/utils";
import { AnimalForm } from "../animalForm/AnimalForm";
import { BreedingGrid } from "../generalUI/BreedingGrid";
import { pages } from "../../utils/pages/utils";
import { handleDeleteAnimal } from "../../utils/animal/handleDeleteAnimal";

export const AnimalPage = () => {
  const user = useOutletContext<User>();
  const { animalId } = useParams();

  const { data: allPairs, mutate: pairsMutator } = useFetchDocs<Pair>(
    user.uid,
    "pairs"
  );
  const { data: allAnimals, mutate: animalsMutator } = useFetchDocs<Animal>(
    user.uid,
    "animals"
  );

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const animal = animalId && allAnimals && getAnimalById(animalId, allAnimals);

  const originalSourcePair =
    animal &&
    allPairs &&
    animal.sourcePair !== "" &&
    getPairById(animal.sourcePair, allPairs);

  const originalSelfPairs =
    animal &&
    allPairs &&
    animal.selfPairs.map((selfPair) => getPairById(selfPair, allPairs));

  // 削除後のnavigation用
  // const navigate = useNavigate();

  return (
    <>
      {animal && allPairs && (
        <div className={pageGapY}>
          <h1 className={pageTitle}>{animal.name}</h1>
          <button
            type="button"
            className="border rounded p-2"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            {isEdit ? "編集をキャンセル" : "編集する"}
          </button>
          {isEdit ? (
            <AnimalForm
              allPairs={allPairs}
              prevAnimal={animal}
              pairsMutator={pairsMutator}
              setIsEdit={setIsEdit}
            />
          ) : (
            <div className={formGapY}>
              {/* 名前 */}
              <div className={fieldGapY}>
                <div>名前</div>
                <div className={inputBox}>{animal.name}</div>
              </div>
              {/* 性別 */}
              <div className={fieldGapY}>
                <div>性別</div>
                <div className={inputBox}>{sexMapping[animal.sex].label}</div>
              </div>
              {/* メモ */}
              <div className={fieldGapY}>
                <div>メモ</div>
                <div className={inputBox}>
                  {animal.note || "データがありません"}
                </div>
              </div>
              {/* sourcePair */}
              <div className={fieldGapY}>
                <div>自分が生まれた家族</div>
                {originalSourcePair ? (
                  <Link
                    to={`/pair/${originalSourcePair.id}`}
                    className={`${inputBox} block ${hover}`}
                  >
                    <BreedingGrid miniPair={originalSourcePair} />
                  </Link>
                ) : (
                  <Link
                    to={`/${pages.pairCreation.path}`}
                    className={msgLikeBtn}
                  >
                    データを作成する
                  </Link>
                )}
              </div>
              {/* selfPairs */}
              <div className={fieldGapY}>
                <div>自分が親である家族</div>
                {originalSelfPairs && originalSelfPairs.length > 0 ? (
                  originalSelfPairs.map((pair, i) => (
                    <Link
                      className={`${inputBox} block ${hover}`}
                      to={`/pair/${pair.id}`}
                    >
                      <BreedingGrid key={i} miniPair={pair} />
                    </Link>
                  ))
                ) : (
                  <Link
                    to={`/${pages.pairCreation.path}`}
                    className={msgLikeBtn}
                  >
                    データを作成する
                  </Link>
                )}
              </div>
              {/* オーナー */}
              <div className={fieldGapY}>
                <div>オーナー</div>
                <div>{animal.ownerId}</div>
              </div>
              {/* 公開状況 */}
              <div className={fieldGapY}>
                <div>公開状況</div>
                <div>{animal.visibility}</div>
              </div>
              {/* 作成日 */}
              <div className={fieldGapY}>
                <div>作成日</div>
                <div>{getLocalDateString(animal.createdAt)}</div>
              </div>
              {/* 作成者 */}
              <div className={fieldGapY}>
                <div>作成したユーザー</div>
                <div>{animal.createdBy}</div>
              </div>
              {/* 更新日 */}
              <div className={fieldGapY}>
                <div>更新日</div>
                <div>{getLocalDateString(animal.updatedAt)}</div>
              </div>
              {/* 更新者 */}
              <div className={fieldGapY}>
                <div>更新したユーザー</div>
                <div>{animal.updatedBy}</div>
              </div>
              {/* 削除ボタン */}
              <button
                type="button"
                className={`${btn} ${btnOutlineRed}`}
                onClick={async () => {
                  try {
                    // 削除処理
                    handleDeleteAnimal(
                      animal,
                      user.uid,
                      allPairs,
                      allAnimals,
                      animalsMutator,
                      pairsMutator
                    );
                    // writeResultの情報を持って動物一覧ページへと遷移
                    // navigate(pages.list.path, { state: result });
                  } catch (err) {
                    // setWriteResult({
                    //   status: "err",
                    //   msgs: convertErrToMsgs(err),
                    // });
                  }
                }}
              >
                この動物を削除する
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
