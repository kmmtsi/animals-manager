import { User } from "firebase/auth";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Animal, MiniAnimal, Pair } from "../../utils/common/definitions";
import {
  WriteResult,
  convertErrToMsgs,
  useFetchDocs,
} from "../../utils/common/utils";
import { btn, btnBlue, formGapY, pageGapY } from "../../utils/css";
import { handleCreatePair } from "../../utils/pair/handleCreatePair";
import { getSuggestableMiniAnimals } from "../../utils/pair/utils";
import { validateMembersNum } from "../../utils/pair/validators";
import { Msg } from "../generalUI/Msg";
import { PairMemberInput } from "./PairMemberInput";

export const PairForm = ({ prevPair }: { prevPair?: Pair }) => {
  const user = useOutletContext<User>();

  const [pairedAnimals, setPairedAnimals] = useState<MiniAnimal[]>(
    prevPair?.pairedAnimals ?? []
  );
  const [children, setChildren] = useState<MiniAnimal[]>(
    prevPair?.children ?? []
  );

  const [writeResult, setWriteResult] = useState<WriteResult | null>(null);

  const { data: pairsData, mutate: pairsMutator } = useFetchDocs<Pair>(
    user.uid,
    "pairs"
  );
  const { data: animalsData, mutate: animalsMutator } = useFetchDocs<Animal>(
    user.uid,
    "animals"
  );

  const allPairs = pairsData ?? [];
  const allAnimals = animalsData ?? [];

  return (
    <div className={pageGapY}>
      {writeResult && (
        <Msg role={writeResult.status}>
          {writeResult.msgs.map((msg, i) => (
            <div key={i} className="py-px">
              {msg}
            </div>
          ))}
        </Msg>
      )}
      {/* フォーム */}
      <div className={formGapY}>
        <PairMemberInput
          field="pairedAnimals"
          members={pairedAnimals}
          setMembers={setPairedAnimals}
          suggestableAnimals={getSuggestableMiniAnimals(
            "pairedAnimals",
            pairedAnimals,
            children,
            allAnimals
          )}
        />
        <PairMemberInput
          field="children"
          members={children}
          setMembers={setChildren}
          suggestableAnimals={getSuggestableMiniAnimals(
            "children",
            pairedAnimals,
            children,
            allAnimals
          )}
        />
        <button
          type="button"
          className={`${btn} ${btnBlue}`}
          onClick={async () => {
            // 前回の書き込み結果をリセット
            setWriteResult(null);
            const res = validateMembersNum(pairedAnimals, children);
            if (res) {
              setWriteResult({
                status: "err",
                msgs: [res],
              });
              return;
            }
            try {
              await handleCreatePair(
                {
                  pairedAnimals,
                  children,
                },
                user.uid,
                allAnimals,
                allPairs,
                {
                  animalMutator: animalsMutator,
                  pairMutator: pairsMutator,
                }
              );
              // 書き込み結果
              setWriteResult({
                status: "success",
                msgs: ["書き込みに成功しました"],
              });
              // リセット
              setPairedAnimals([]);
              setChildren([]);
            } catch (err) {
              setWriteResult({
                status: "err",
                msgs: convertErrToMsgs(err),
              });
            }
          }}
        >
          {prevPair ? "ペアを更新" : "ペアを作成"}
        </button>
      </div>
    </div>
  );
};
