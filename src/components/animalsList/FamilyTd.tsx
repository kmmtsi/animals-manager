import { Pair } from "../../utils/common/definitions";
import { getPairById } from "../../utils/pair/utils";
import { NameAndSex } from "../generalUI/NameAndSex";
import { Td } from "./Td";

export const PairTd = ({
  pairIds,
  field,
  allPairs,
}: {
  pairIds: string[];
  field: "pairedAnimals" | "children";
  allPairs: Pair[];
}) => {
  return (
    <Td>
      <div>
        {pairIds.map((pairId) => {
          const pair = getPairById(pairId, allPairs);
          return pair[field].map((miniAnimal) => {
            return <NameAndSex animal={miniAnimal} />;
          });
        })}
      </div>
    </Td>
  );
};
