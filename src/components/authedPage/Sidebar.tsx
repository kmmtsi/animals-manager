import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zSidebarLg, zSidebarSm } from "../../utils/css";
import { CloseNav } from "./AuthedPage";
import { GlobalNavigation } from "./GlobalNavigation";

export const Sidebar = ({
  isNavOpen,
  closeNav,
}: {
  isNavOpen: boolean;
  closeNav: CloseNav;
}) => (
  <>
    {/* Lgのとき */}
    <div className={`hidden lg:block p-4 col-span-2 relative ${zSidebarLg}`}>
      <GlobalNavigation />
    </div>

    {/* Smのとき */}
    <div className={`block lg:hidden relative ${zSidebarSm}`}>
      {/* 背景 */}
      <div
        className={`${
          isNavOpen ? "block" : "hidden"
        } fixed inset-0 bg-black/10 drop-shadow-xl backdrop-blur-sm`}
        onClick={() => closeNav()}
      />
      {/* 本体 */}
      <div
        className={`${
          isNavOpen ? "block" : "hidden"
        } fixed left-0 inset-y-0 right-12 p-4 bg-white`}
      >
        {/* sideNavを閉じるボタン */}
        <button type="button" onClick={() => closeNav()} className="ml-1 mb-2">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {/* sideNav */}
        <GlobalNavigation closeNav={closeNav} />
      </div>
    </div>
  </>
);
