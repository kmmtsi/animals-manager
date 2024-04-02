import { navItems } from "../../utils/common/pageUtils";
import { GlobalNavigationItem } from "./GlobalNavigationItem";

export const GlobalNavigation = ({ closeNav }: { closeNav: () => void }) => {
  return (
    <nav>
      <div className="space-y-1">
        {navItems.map((page, i) => (
          <GlobalNavigationItem
            key={i}
            page={page}
            onClick={() => closeNav()}
          />
        ))}
      </div>
    </nav>
  );
};
