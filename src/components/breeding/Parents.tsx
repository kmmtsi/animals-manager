import { MiniAnimal } from "../../utils/common/definitions";
import { NameAndSex } from "../animal/NameAndSex";

export const Parents = ({
  parents,
  isAnimalLink,
}: {
  parents: MiniAnimal[];
  isAnimalLink?: boolean;
}) => {
  return (
    <>
      {parents.length > 0 ? (
        <div className={`flex gap-x-1.5 items-center w-fit`}>
          <NameAndSex animal={parents[0]} isLink={isAnimalLink} />
          {parents.length === 2 && (
            <>
              <span className="text-xs text-slate-300">x</span>
              <NameAndSex animal={parents[1]} isLink={isAnimalLink} />
            </>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
