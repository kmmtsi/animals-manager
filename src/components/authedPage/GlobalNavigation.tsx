import { navItems } from "../../utils/common/pageUtils";
import { CloseNav } from "./AuthedPage";
import { GlobalNavigationItem } from "./GlobalNavigationItem";

export const GlobalNavigation = ({ closeNav }: { closeNav?: CloseNav }) => {
  return (
    <nav>
      <div className="space-y-1">
        {navItems.map((navItem, i) => (
          <GlobalNavigationItem
            key={i}
            navItem={navItem}
            closeNav={closeNav}
          />
        ))}
      </div>
    </nav>
  );
};
