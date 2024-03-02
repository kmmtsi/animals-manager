import { faFileImport, faListUl, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  {
    path: "",
    name: "動物一覧",
    icon: faListUl,
  },
  {
    path: "create",
    name: "新規追加",
    icon: faPlus,
  },
  {
    path: "import",
    name: "インポート",
    icon: faFileImport,
  },
  {
    path: "account",
    name: "アカウント",
    icon: faUser,
  },
];
