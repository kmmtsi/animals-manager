// animals
export const minAnimalName = 1;
export const maxAnimalName = 50;
export const maxSelfPairs = 20;
export const maxNote = 500;

// pairs
export const maxPairedAnimals = 2;
export const maxChildren = 30;

export const sexOptions = [
  { label: "未入力", value: "" },
  { label: "オス", value: "male" },
  { label: "メス", value: "female" },
] as const; // 「サバイバルTypeScript > 配列から型を生成する」を参照

// typescript用
export const sexValues = sexOptions.map((option) => option.value);

export const sexMapping = {
  "": {
    label: "未入力",
    value: "",
  },
  male: {
    label: "オス",
    value: "male",
  },
  female: {
    label: "メス",
    value: "female",
  },
};

export type Sex = (typeof sexValues)[number];

export const familyMapping: Record<string, string> = {
  parents: "親",
  children: "子ども",
};

export type Visibility = "private"; // publicは後に実装

export type Animal = {
  id: string;
  name: string;
  sex: Sex;
  sourcePair: string; // idの配列
  selfPairs: string[]; // idの配列
  note: string;
  ownerId: string;
  visibility: Visibility;
  createdAt: string;
  createdBy: string; // userId
  updatedAt: string;
  updatedBy: string; // userId
};
export type MiniAnimal = {
  id: string;
  name: string;
  sex: Sex;
};
export type AnimalKey = keyof Animal;

export type Pair = {
  id: string;
  pairedAnimals: MiniAnimal[];
  children: MiniAnimal[];
  createdAt: string;
  createdBy: string; // userId
  updatedAt: string;
  updatedBy: string; // userId
};
export type MiniPair = {
  id: string;
  pairedAnimals: MiniAnimal[];
  children: MiniAnimal[];
};
export type PairKey = keyof Pair;
