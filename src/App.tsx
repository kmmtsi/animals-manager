import { Container } from "./components/Container";
import { AddAnimal } from "./components/AddAnimal";
// import { Sidebar } from "./components/Sidebar";
import { useState, useEffect } from "react";
import { ListAnimal } from "./components/ListAnimal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { SingleAnimal } from "./components/SingleAnimal";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase";
import { User } from "firebase/auth";
import { SignIn } from "./components/SignIn";
import { Account } from "./components/Account";

export const App = () => {
  const [currentComp, setCurrentComp] = useState("list");

  const navItems = [
    {
      name: "list",
      title: "動物一覧",
      icon: faListUl,
    },
    {
      name: "add",
      title: "新規追加",
      icon: faPlus,
    },
    {
      name: "account",
      title: "アカウント",
      icon: faUser,
    },
  ];

  /* Authenticationの確認 */
  type CustomUserType = User | null | undefined;
  const [user, setUser] = useState<CustomUserType>(undefined);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
      console.log("Unsubscribe");
    };
  }, []);

  return (
    <>
      {user === undefined && (
        // ユーザー検証中
        <div></div>
      )}
      {user === null && (
        // ユーザー未ログイン
        <div>
          <SignIn />
        </div>
      )}
      {user && (
        // ユーザーログイン時
        <div className="bg-slate-50 text-slate-900">
          <header className="border-b h-16 sticky flex items-center">
            <Container>
              <div>
                <a href="/">Animals manager</a>
              </div>
              <nav>
                <ul>
                  <li></li>
                </ul>
              </nav>
            </Container>
          </header>
          <Container className="grid grid-cols-12">
            {/* サイドバーエリア */}
            <aside className="col-span-2 h-[calc(100vh-64px)] pr-2 py-4">
              {/* サイドナビゲーション */}
              <nav className="bg-white h-full px-4 py-4 rounded">
                <ul className="flex flex-col gap-y-2">
                  {navItems.map((item) => (
                    // メニューアイテム
                    <li
                      key={item.name}
                      className={`rounded px-2 py-2${
                        item.name === currentComp ? " bg-slate-50" : ""
                      }`}
                    >
                      <button
                        onClick={() => setCurrentComp(item.name)}
                        className="flex items-center gap-x-2 w-full"
                      >
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
            {/* メインエリア */}
            <main className="col-span-10 pl-2 py-4">
              <div className="bg-white rounded px-4 py-4">
                {currentComp === "list" && (
                  <ListAnimal setCurrentComp={setCurrentComp} />
                )}
                {currentComp === "add" && <AddAnimal />}
                {currentComp === "single" && <SingleAnimal />}
                {currentComp === "account" && <Account />}
              </div>
            </main>
          </Container>
        </div>
      )}
    </>
  );
};
