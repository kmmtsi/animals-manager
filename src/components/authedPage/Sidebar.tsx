import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalNavigation } from "./GlobalNavigation";

export const Sidebar = ({
  isNavOpen,
  closeNav,
}: {
  isNavOpen: boolean;
  closeNav: () => void;
}) => {
  return (
    <>
      {/* 背景 */}
      <div
        className={`${
          isNavOpen ? "block" : "hidden"
        } lg:hidden fixed inset-0 bg-black/10 drop-shadow-xl backdrop-blur-sm`}
        onClick={() => closeNav()}
      />
      {/* sideNavのラッパー */}
      <div
        className={`${
          isNavOpen ? "block" : "hidden"
        } fixed z-10 left-0 inset-y-0 right-12 lg:block lg:static lg:col-span-2 p-4 bg-white`}
      >
        {/* sideNavを閉じるボタン */}
        <button
          type="button"
          onClick={() => closeNav()}
          className="lg:hidden ml-1 mb-2"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {/* sideNav */}
        <GlobalNavigation closeNav={closeNav} />
      </div>
    </>
  );
};
