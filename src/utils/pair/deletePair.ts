import { WriteBatch } from "firebase/firestore";
import { Pair } from "../common/definitions";
import { modifyCopiedDocs } from "../common/utils";
import { getRef } from "../common/utils";

export const deletePair = (
  pair: Pair,
  userId: string,
  batch: WriteBatch,
  copiedAllPairs: Pair[]
) => {
  const ref = getRef(userId, "pairs", pair.id);

  batch.delete(ref);

  modifyCopiedDocs("deleted", pair, copiedAllPairs);

  return pair;
};
