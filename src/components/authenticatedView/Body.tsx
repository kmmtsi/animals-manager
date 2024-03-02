import { useState } from "react";
import { Container } from "../generalUI/Container";
import { User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { hover } from "../../utils/css";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { navItems } from "../../utils/pages/utils";

export const Body = ({ user }: { user: User }) => {
  // navが開いているかどうか
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  return (
    <Container className="grid grid-cols-12">
      {/* sideNav表示切替ボタンラッパー */}
      <div className="col-span-12 lg:hidden flex gap-x-2 py-2 border-b">
        {/* sideNav表示切替ボタン */}
        <button
          type="button"
          onClick={() => setIsNavOpen((prev) => !prev)}
          className="flex items-center justify-center gap-x-2"
        >
          <FontAwesomeIcon icon={isNavOpen ? faXmark : faBars} />
          メニュー
        </button>
      </div>
      {/* sideNav背景 */}
      <div
        className={`${
          isNavOpen ? "fixed" : "hidden"
        } inset-0 bg-black/10 drop-shadow-xl backdrop-blur-sm`}
        onClick={() => setIsNavOpen(false)} // クリックでsideNav閉じる
      />
      {/* sideNavのラッパー */}
      <div
        className={`${
          isNavOpen ? "fixed" : "hidden"
        } z-10 left-0 inset-y-0 right-12 px-4 py-4 bg-white lg:block lg:col-span-2 `}
      >
        {/* sideNavを閉じるボタン */}
        <button
          type="button"
          onClick={() => setIsNavOpen(false)}
          className="lg:hidden mb-2"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {/* sideNav */}
        <nav>
          <ul className="flex flex-col gap-y-2">
            {navItems.map((item, i) => (
              // メニューアイテム
              <li key={i}>
                <NavLink
                  to={item.path}
                  onClick={() => {
                    setIsNavOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-x-2 w-full text-sm rounded px-2 py-2 ${hover} ${
                      isActive ? "bg-slate-200" : ""
                    }`
                  }
                >
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* メインエリア */}
      <main className="col-span-12 lg:col-span-10 px-4 pt-4 pb-20">
        <Outlet context={user} />
      </main>
    </Container>
  );
};
