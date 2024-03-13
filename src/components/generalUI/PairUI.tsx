import { Link } from "react-router-dom";
import { MiniAnimal } from "../../utils/common/definitions";
import { pairLink } from "../../utils/css";
import { NameAndSex } from "./NameAndSex";

export const PairUI = ({
  pairId,
  pairedAnimals,
  isLink,
  isAnimalLink,
}: {
  pairId: string;
  pairedAnimals: MiniAnimal[];
  isLink?: boolean;
  isAnimalLink?: boolean;
}) => {
  const body = (
    <div
      data-id={pairId}
      className={`flex gap-x-1.5 items-center w-fit ${isLink ? pairLink : ""}`}
    >
      <NameAndSex animal={pairedAnimals[0]} isLink={isAnimalLink} />
      {pairedAnimals.length === 2 && (
        <>
          <span className="text-xs text-slate-300">x</span>
          <NameAndSex animal={pairedAnimals[1]} isLink={isAnimalLink} />
        </>
      )}
    </div>
  );

  return isLink ? (
    // inline-block + w-fitでリンクの幅をbodyの幅に合わせる
    <Link to={`/pair/${pairId}`} className="inline-block w-fit">
      {body}
    </Link>
  ) : (
    body
  );
};
