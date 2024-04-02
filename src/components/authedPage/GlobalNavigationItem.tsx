import {
  IconDefinition,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, useState } from "react";
import { NavLink } from "react-router-dom";
import { hover } from "../../utils/css";

type Page = {
  path: string;
  name: string;
  icon: IconDefinition;
  children?: Page[];
};

export const GlobalNavigationItem = ({
  page,
  onClick,
}: {
  page: Page;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) => {
  const { path, name, icon, children } = page;
  const [isChildrenOpen, setIsChildrenOpen] = useState<boolean>(false);

  return (
    <div className="space-y-1">
      <div
        className={`rounded p-1 flex items-center has-[a[aria-current="page"]]:bg-blue-50`}
      >
        {children && children.length > 0 && (
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
          onClick={onClick}
          className={({ isActive }) => {
            return `rounded p-1.5 flex items-center gap-x-2 w-full ${hover} ${
              isActive ? "font-bold text-blue-500" : ""
            }`;
          }}
        >
          <FontAwesomeIcon icon={icon} />
          <span>{name}</span>
        </NavLink>
      </div>
      {children && isChildrenOpen && (
        <div className="pl-3">
          <div className="border-l pl-1 py-0.5">
            {children.map((child, i) => (
              <GlobalNavigationItem key={i} page={child} onClick={onClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
