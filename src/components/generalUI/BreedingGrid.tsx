import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MiniPair } from "../../utils/common/definitions";
import { Children } from "./Children";
import { PairUI } from "./PairUI";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export const BreedingGrid = ({ miniPair }: { miniPair: MiniPair }) => {
  return (
    <div data-id={miniPair.id} className="grid grid-cols-12">
      {/* 親 */}
      <div className="col-span-12 md:col-span-4">
        <PairUI pairId={miniPair.id} pairedAnimals={miniPair.pairedAnimals} />
      </div>
      {miniPair.children.length > 0 && (
        <>
          <div className="hidden md:block md:col-span-1">
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-xs text-slate-300"
            />
          </div>
          <div className="col-span-12 md:hidden">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-xs text-slate-300"
            />
          </div>
          {/* 兄弟 */}
          <div className="col-span-12 md:col-span-7">
            <Children children={miniPair.children} />
          </div>
        </>
      )}
    </div>
  );
};
