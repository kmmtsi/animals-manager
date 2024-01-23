import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

export const Sidebar = ({
  currentComp,
  setCurrentComp,
}: {
  currentComp: string;
  setCurrentComp: (name: string) => void;
}) => {
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
  return (
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
  );
};
