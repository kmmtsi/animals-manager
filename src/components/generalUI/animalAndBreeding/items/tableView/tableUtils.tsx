import { ReactNode, useState } from "react";
import {
  convertDateToLocalDateString,
  convertTsToLocalDateString,
  isArraysEqual,
} from "../../../../../utils/common/commonUtils";
import { Animal, Breeding } from "../../../../../utils/common/definitions";
import { HealthCondition } from "../../../../animal/formattedValues/HealthCondition";
import { NameAndSex } from "../../../../animal/formattedValues/NameAndSex";
import { Status } from "../../../../breeding/formattedValues/Status";

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
export type AnimalColumnPreferences = Record<
  keyof Omit<
    Animal,
    | "id"
    | "sex"
    | "breedingIdAsChild"
    | "breedingIdsAsParent"
    | "folderIds"
    | "createdBy"
    | "updatedBy"
  >,
  boolean
>;

export type BreedingColumnPreferences = Record<
  keyof Omit<Breeding, "id" | "folderIds" | "createdBy" | "updatedBy">,
  boolean
>;

export type ColumnPreferences<T extends Animal | Breeding> = T extends Animal
  ? AnimalColumnPreferences
  : BreedingColumnPreferences;

const getDefaultColumnPreferences = <T extends Animal | Breeding>(
  type: T extends Animal ? "animals" : "breedings"
): ColumnPreferences<T> => {
  if (type === "animals") {
    const AnimalColP: AnimalColumnPreferences = {
      name: true,
      healthCondition: true,
      dateOfBirth: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    };
    return AnimalColP as ColumnPreferences<T>;
  } else {
    const BreedingColP: BreedingColumnPreferences = {
      parents: true,
      children: true,
      status: true,
      startDate: true,
      endDate: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    };
    return BreedingColP as ColumnPreferences<T>;
  }
};

export const useColumnPreferences = <T extends Animal | Breeding>(
  type: T extends Animal ? "animals" : "breedings"
) => {
  const key = type === "animals" ? "animalFsToS" : "breedingFsToS";

  // データを取得
  const localFsToSString = localStorage.getItem(key);

  let localFsToS: ColumnPreferences<T>;
  const defaultFsToS = getDefaultColumnPreferences<T>(type);

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

  const [fsToS, setFsToS] = useState<ColumnPreferences<T>>(localFsToS);

  const handleCheckFToS = (field: keyof ColumnPreferences<T>) => {
    const newFsToS = { ...fsToS };
    (newFsToS[field] as boolean) = !fsToS[field];
    // state更新
    setFsToS(newFsToS);
    // localStorage更新
    localStorage.setItem(key, JSON.stringify(newFsToS));
  };

  return { fsToS, handleCheckFToS };
};

export type ColumnData<T extends Animal | Breeding | (Animal | Breeding)> = {
  field: keyof ColumnPreferences<T>;
  css: string;
  content: (item: T) => ReactNode;
};

// 共通
const note: ColumnData<Animal | Breeding> = {
  field: "note",
  css: "min-w-44",
  content: (item) => item.note,
};
const createdAt: ColumnData<Animal | Breeding> = {
  field: "createdAt",
  css: "min-w-24",
  content: (item) => convertTsToLocalDateString(item.createdAt),
};
// const createdBy: ColumnData<Animal | Breeding> = {
//   field: "createdBy",
//   css: "min-w-24",
//   content: (item) => <UserName id={item.createdBy} />,
// };
const updatedAt: ColumnData<Animal | Breeding> = {
  field: "updatedAt",
  css: "min-w-24",
  content: (item) => convertTsToLocalDateString(item.updatedAt),
};
// const updatedBy: ColumnData<Animal | Breeding> = {
//   field: "updatedBy",
//   css: "min-w-24",
//   content: (item) => <UserName id={item.updatedBy} />,
// };

// animal
const name: ColumnData<Animal> = {
  field: "name",
  css: "min-w-24",
  content: (item) => (
    <div className="font-semibold">
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
const healthCondition: ColumnData<Animal> = {
  field: "healthCondition",
  css: "min-w-24",
  content: (item) => (
    <HealthCondition value={item.healthCondition} enableEmpty={true} />
  ),
};
const dateOfBirth: ColumnData<Animal> = {
  field: "dateOfBirth",
  css: "min-w-24",
  content: (item) =>
    item.dateOfBirth ? convertDateToLocalDateString(item.dateOfBirth) : "",
};

// breeding
const parents: ColumnData<Breeding> = {
  field: "parents",
  css: "min-w-36",
  content: (item) => (
    <div className="space-y-1 font-semibold">
      {item.parents.map((parent, i) => (
        <NameAndSex key={i} animal={parent} />
      ))}
    </div>
  ),
};
const children: ColumnData<Breeding> = {
  field: "children",
  css: "min-w-36",
  content: (item) => (
    <div className="space-y-1 font-semibold">
      {item.children.map((child, i) => (
        <NameAndSex key={i} animal={child} />
      ))}
    </div>
  ),
};
const status: ColumnData<Breeding> = {
  field: "status",
  css: "min-w-24",
  content: (item) => <Status value={item.status} enableEmpty={true} />,
};
const startDate: ColumnData<Breeding> = {
  field: "startDate",
  css: "min-w-24",
  content: (item) =>
    item.startDate ? convertDateToLocalDateString(item.startDate) : "",
};
const endDate: ColumnData<Breeding> = {
  field: "endDate",
  css: "min-w-24",
  content: (item) =>
    item.endDate ? convertDateToLocalDateString(item.endDate) : "",
};

export type ColumnDataBundle<T extends Animal | Breeding> = Record<
  keyof ColumnPreferences<T>,
  ColumnData<T>
>;

export const animalColumnDataBundle: ColumnDataBundle<Animal> = {
  name,
  healthCondition,
  dateOfBirth,
  note,
  createdAt,
  updatedAt,
};

export const breedingColumnDataBundle: ColumnDataBundle<Breeding> = {
  parents,
  children,
  status,
  note,
  startDate,
  endDate,
  createdAt,
  updatedAt,
};
