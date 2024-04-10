import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { NavItem } from "../../utils/common/pageUtils";
import { hover } from "../../utils/css";
import { CloseNav } from "./AuthedPage";

export const GlobalNavigationItem = ({
  navItem,
  closeNav,
}: {
  navItem: NavItem;
  closeNav?: CloseNav;
}) => {
  const { t } = useTranslation();
  
  const { path, name, icon, children } = navItem;
  const [isChildrenOpen, setIsChildrenOpen] = useState<boolean>(false);

  return (
    <div className="space-y-1">
      <div className='rounded flex items-center has-[a[aria-current="page"]]:bg-blue-50'>
        {children && children.length > 0 && (
          // 子要素を開くボタン
          <button
            className={`rounded p-1 text-slate-400 text-xs ${hover} w-6 h-6`}
            onClick={() => setIsChildrenOpen((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={isChildrenOpen ? faChevronDown : faChevronRight}
            />
          </button>
        )}
        <NavLink
          to={path}
          end={false}
          onClick={() => closeNav && closeNav()}
          className={({ isActive }) => {
            return `rounded p-1.5 flex items-center gap-x-2 w-full ${hover} ${
              isActive ? "font-bold text-blue-500" : ""
            }`;
          }}
        >
          <FontAwesomeIcon icon={icon} />
          <span>{t(name)}</span>
        </NavLink>
      </div>
      {children && isChildrenOpen && (
        <div className="pl-3">
          <div className="border-l pl-1 py-0.5">
            {children.map((child, i) => (
              <GlobalNavigationItem
                key={i}
                navItem={child}
                closeNav={closeNav}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
