import { MiniBreeding } from "../../utils/common/definitions";
import {
  NameAndSex,
  OnAnimalClick,
} from "../animal/formattedValues/NameAndSex";

export const BreedingGrid = ({
  miniBreeding,
  onAnimalClick,
}: {
  miniBreeding: MiniBreeding;
  onAnimalClick?: OnAnimalClick;
}) => {
  const membersBox = `border border-slate-400 p-2 rounded h-full flex items-center flex-wrap gap-2 bg-white`;
  return (
    <div
      data-id={miniBreeding.id}
      className="grid grid-cols-12 grid-rows-12 font-semibold"
    >
      {/* parent1 */}
      <div className="col-start-1 col-span-5 row-start-1 row-span-6 py-1">
        <div className={membersBox}>
          {miniBreeding.parents[0] && (
            <NameAndSex
              animal={miniBreeding.parents[0]}
              onAnimalClick={onAnimalClick}
            />
          )}
        </div>
      </div>
      {/* parent2 */}
      <div className="col-start-1 col-span-5 row-end-13 row-span-6 py-1">
        <div className={membersBox}>
          {miniBreeding.parents[1] && (
            <NameAndSex
              animal={miniBreeding.parents[1]}
              onAnimalClick={onAnimalClick}
            />
          )}
        </div>
      </div>
      {/* squareish */}
      <div className="col-start-6 col-span-1 row-start-4 row-span-6 border-r border-y border-slate-400" />
      {/* line */}
      <div className="col-start-7 col-span-1 row-start-1 row-span-6 border-b border-slate-400" />
      {/* children */}
      <div className="col-end-13 col-span-5 row-span-12 py-1">
        <div className={membersBox}>
          {miniBreeding.children.map((child, i) => (
            <NameAndSex key={i} animal={child} onAnimalClick={onAnimalClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
