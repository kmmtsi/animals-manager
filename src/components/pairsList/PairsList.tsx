import { User } from "firebase/auth";
import { Link, useOutletContext } from "react-router-dom";
import { Animal, Pair } from "../../utils/common/definitions";
import { useFetchDocs } from "../../utils/common/utils";
import { msgLikeBtn, pageTitle, table, td, th } from "../../utils/css";
import { pages } from "../../utils/pages/utils";
import { Children } from "../generalUI/Children";
import { PairUI } from "../generalUI/PairUI";

export const PairsList = () => {
  const user = useOutletContext<User>();

  const { data: allPairs } = useFetchDocs<Pair>(user.uid, "pairs");
  const { data: allAnimals } = useFetchDocs<Animal>(user.uid, "animals");

  return (
    <div className="space-y-6">
      <div className={pageTitle}>ペア一覧</div>
      {/* pairsとanimalsのそれぞれに1つ以上データがあるときのみテーブルを表示する */}
      {allPairs && allAnimals && (
        <div>
          {allPairs.length === 0 ? (
            <Link to={`/${pages.pairCreation.path}`} className={msgLikeBtn}>
              ＋ ペアを作成する
            </Link>
          ) : (
            <table className={table}>
              {/* テーブルヘッダー */}
              <thead>
                <tr>
                  <th className={th}>ペアリングされた動物</th>
                  <th className={th}>子</th>
                </tr>
              </thead>
              {/* テーブルボディ */}
              <tbody>
                {allPairs.map((pair) => {
                  return (
                    <tr key={pair.id}>
                      {/* pairedAnimals */}
                      <td className={td}>
                        <PairUI
                          pairId={pair.id}
                          pairedAnimals={pair.pairedAnimals}
                          isLink={true}
                        />
                      </td>
                      {/* children */}
                      <td className={td}>
                        <Children children={pair.children} />
                      </td>
                    </tr>
                  );
                })}
                <tr></tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
