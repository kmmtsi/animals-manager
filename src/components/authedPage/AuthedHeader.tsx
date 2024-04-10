import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPathToAllAnimals } from "../../utils/common/pageUtils";
import { container } from "../../utils/css";
import { Logo } from "../generalUI/logo/Logo";

export const AuthedHeader = ({ openNav }: { openNav: () => void }) => {
  return (
    <header className="border-b h-16 sticky flex items-center">
      <div className={`flex items-center justify-between ${container}`}>
        <Logo options={{ linkTo: getPathToAllAnimals() }} />
        <button type="button" onClick={() => openNav()} className="lg:hidden">
          <FontAwesomeIcon icon={faBars} className="text-lg text-slate-800" />
        </button>
      </div>
    </header>
  );
};
