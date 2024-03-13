import {
  IconDefinition,
  faListUl,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { RouteObject } from "react-router-dom";
import { Account } from "../../components/account/Account";
import { AnimalPage } from "../../components/animalPage/AnimalPage";
import { AnimalCreation } from "../../components/animalCreation/AnimalCreation";
import { AnimalsList } from "../../components/animalsList/AnimalsList";
import { Environment } from "../../components/environment/Environment";
import { PairForm } from "../../components/pairForm/PairForm";
import { PairsList } from "../../components/pairsList/PairsList";
import { PairPage } from "../../components/pairPage/PairPage";

// ページ情報の型
type PageInfo = {
  path: string;
  index: boolean;
  name: string | null;
  icon: IconDefinition | null;
  element: ReactNode;
};

/**
 * ページ情報
 * プロパティ名を変更する場合は参照されてる可能性があるので注意する
 */
export const pages: Record<string, PageInfo> = {
  animalsList: {
    path: "/", // AnimalFormの削除後のリダイレクト先として使用中
    index: true,
    name: "動物リスト",
    icon: faListUl,
    element: <AnimalsList />,
  },
  create: {
    path: "create",
    index: false,
    name: "新規追加",
    icon: faPlus,
    element: <AnimalCreation />,
  },
  environment: {
    path: "environment",
    index: false,
    name: "飼育環境",
    icon: faPlus,
    element: <Environment />,
  },
  pair: {
    path: "pair/list",
    index: false,
    name: "ペア一覧",
    icon: faListUl,
    element: <PairsList />,
  },
  pairCreation: {
    path: "pair/create",
    index: false,
    name: "ペア作成",
    icon: faPlus,
    element: <PairForm />,
  },
  account: {
    path: "account",
    index: false,
    name: "アカウント",
    icon: faUser,
    element: <Account />,
  },
  animalPage: {
    path: "animal/:animalId",
    index: false,
    name: null, // 各動物のIDになるので表示名なし（下で条件分岐に使用しているので変更時は気を付ける）
    icon: null,
    element: <AnimalPage />,
  },
  pairPage: {
    path: "pair/:pairId",
    index: false,
    name: null, // 各動物のIDになるので表示名なし（下で条件分岐に使用しているので変更時は気を付ける）
    icon: null,
    element: <PairPage />,
  },
};

// object.entriesの戻り値：['list', {…}], ...

/**
 * React routerに渡す用のページ情報
 * @returns
 */
export const getPagesForRouter = (): RouteObject[] => {
  // objectのvalueのみを取得
  const pageInfos = Object.values(pages);

  return pageInfos.map((pageInfo) => {
    if (pageInfo.index) {
      // indexがtrueのときはpathを返さずindexを返す
      return {
        index: pageInfo.index,
        element: pageInfo.element,
      };
    } else {
      // indexがfalseのとき
      return {
        path: pageInfo.path,
        element: pageInfo.element,
      };
    }
  });
};

/**
 * 上で定義したページ群を配列にして返す
 * @returns
 */
export const getPagesForNav = () => {
  const pagesForNav: {
    path: string;
    name: string;
    icon: IconDefinition;
  }[] = [];

  Object.values(pages).forEach((page) => {
    if (page.name && page.icon) {
      // nameがnullでないとき
      pagesForNav.push({
        path: page.path,
        name: page.name,
        icon: page.icon,
      });
    }
  });
  return pagesForNav;
};

// import: {
//   path: "import",
//   name: "インポート",
//   icon: faFileImport,
// },
