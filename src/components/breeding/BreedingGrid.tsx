import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MiniBreeding } from "../../utils/common/definitions";
import { Children } from "./Children";
import { Parents } from "./Parents";

export const BreedingGrid = ({
  miniBreeding,
}: {
  miniBreeding: MiniBreeding;
}) => {
  return (
    <div data-id={miniBreeding.id} className="grid grid-cols-12">
      {/* 親 */}
      <div className="col-span-12 md:col-span-4">
        <Parents parents={miniBreeding.parents} />
      </div>
      {miniBreeding.children.length > 0 && (
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
            <Children children={miniBreeding.children} />
          </div>
        </>
      )}
    </div>
  );
};
