import { ReactNode, useState } from "react";
import {
  convertDateToLocalDateString,
  convertTsToLocalDateString,
  isArraysEqual,
} from "../../../../../utils/common/commonUtils";
import {
  Animal,
  Breeding,
  statusOptions,
} from "../../../../../utils/common/definitions";
import { NameAndSex } from "../../../../animal/NameAndSex";
import { Children } from "../../../../breeding/Children";
import { Parents } from "../../../../breeding/Parents";
import { UserName } from "../../../UserName";

export const useCheckTable = <T extends Animal | Breeding>() => {
  const [checkedItems, setCheckedItems] = useState<T[]>([]);

  const check = (clickedItem: T) => {
    if (checkedItems.includes(clickedItem)) {
      setCheckedItems(checkedItems.filter((br) => br !== clickedItem));
    } else {
      setCheckedItems([...checkedItems, clickedItem]);
    }
  };

  const checkAll = (allItems: T[]) => {
    if (checkedItems.length === allItems.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(allItems);
    }
  };

  const clearCheck = () => setCheckedItems([]);

  return { checkedItems, check, checkAll, clearCheck };
};

/*******************
 ****** FsToS ******
 *******************/
export type AnimalFsToS = Record<
  keyof Omit<
    Animal,
    "id" | "sex" | "breedingIdAsChild" | "breedingIdsAsParent" | "folderIds"
  >,
  boolean
>;

export type BreedingFsToS = Record<
  keyof Omit<Breeding, "id" | "folderIds">,
  boolean
>;

export type FsToS<T extends Animal | Breeding> = T extends Animal
  ? AnimalFsToS
  : BreedingFsToS;

const getDefaultFsToS = <T extends Animal | Breeding>(
  type: T extends Animal ? "animals" : "breedings"
): FsToS<T> => {
  if (type === "animals") {
    return {
      name: true,
      note: true,
      createdAt: true,
      createdBy: true,
      updatedAt: true,
      updatedBy: true,
    } as FsToS<T>;
  } else {
    return {
      parents: true,
      children: true,
      status: true,
      startDate: true,
      endDate: true,
      note: true,
      createdAt: true,
      createdBy: true,
      updatedAt: true,
      updatedBy: true,
    } as FsToS<T>;
  }
};

export const useFsToS = <T extends Animal | Breeding>(
  type: T extends Animal ? "animals" : "breedings"
) => {
  const key = type === "animals" ? "animalFsToS" : "breedingFsToS";

  // データを取得
  const localFsToSString = localStorage.getItem(key);

  let localFsToS: FsToS<T>;
  const defaultFsToS = getDefaultFsToS<T>(type);

  if (localFsToSString) {
    // 既存の設定があった場合
    localFsToS = JSON.parse(localFsToSString);
    if (!isArraysEqual(Object.keys(localFsToS), Object.keys(defaultFsToS))) {
      // 最新バージョンではない場合
      localStorage.setItem(key, JSON.stringify(defaultFsToS));
      localFsToS = defaultFsToS;
    }
  } else {
    // 既存の設定が無かった場合
    localStorage.setItem(key, JSON.stringify(defaultFsToS));
    localFsToS = defaultFsToS;
  }

  const [fsToS, setFsToS] = useState<FsToS<T>>(localFsToS);

  const handleCheckFToS = (field: keyof FsToS<T>) => {
    const newFsToS = { ...fsToS };
    (newFsToS[field] as boolean) = !fsToS[field];
    // state更新
    setFsToS(newFsToS);
    // localStorage更新
    localStorage.setItem(key, JSON.stringify(newFsToS));
  };

  return { fsToS, handleCheckFToS };
};

export type RenderData<T extends Animal | Breeding | (Animal | Breeding)> = {
  field: keyof FsToS<T>;
  css: string;
  content: (item: T) => ReactNode;
};

const name: RenderData<Animal> = {
  field: "name",
  css: "min-w-24",
  content: (item) => (
    <div className="font-bold">
      <NameAndSex
        animal={{
          id: item.id,
          name: item.name,
          sex: item.sex,
        }}
      />
    </div>
  ),
};
const note: RenderData<Animal | Breeding> = {
  field: "note",
  css: "min-w-44",
  content: (item) => item.note,
};
const parents: RenderData<Breeding> = {
  field: "parents",
  css: "min-w-36",
  content: (item) => <Parents parents={item.parents} />,
};
const children: RenderData<Breeding> = {
  field: "children",
  css: "min-w-36",
  content: (item: Breeding) => <Children children={item.children} />,
};
const status: RenderData<Breeding> = {
  field: "status",
  css: "min-w-24",
  content: (item) =>
    statusOptions.find((opt) => opt.value === item.status)?.label,
};
const startDate: RenderData<Breeding> = {
  field: "startDate",
  css: "min-w-24",
  content: (item) =>
    item.startDate ? convertDateToLocalDateString(item.startDate) : "",
};
const endDate: RenderData<Breeding> = {
  field: "endDate",
  css: "min-w-24",
  content: (item) =>
    item.endDate ? convertDateToLocalDateString(item.endDate) : "",
};
const createdAt: RenderData<Animal | Breeding> = {
  field: "createdAt",
  css: "min-w-24",
  content: (item) => convertTsToLocalDateString(item.createdAt),
};
const createdBy: RenderData<Animal | Breeding> = {
  field: "createdBy",
  css: "min-w-24",
  content: (item) => <UserName id={item.createdBy} />,
};
const updatedAt: RenderData<Animal | Breeding> = {
  field: "updatedAt",
  css: "min-w-24",
  content: (item) => convertTsToLocalDateString(item.updatedAt),
};
const updatedBy: RenderData<Animal | Breeding> = {
  field: "updatedBy",
  css: "min-w-24",
  content: (item) => <UserName id={item.updatedBy} />,
};

export type RenderDataBundle<T extends Animal | Breeding> = Record<
  keyof FsToS<T>,
  RenderData<T>
>;

export const animalRenderDataBundle: RenderDataBundle<Animal> = {
  name,
  note,
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
};

export const breedingRenderDataBundle: RenderDataBundle<Breeding> = {
  parents,
  children,
  status,
  note,
  startDate,
  endDate,
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
};
