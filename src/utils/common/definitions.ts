import i18n from "../../i18n/config";

/**********
 * Animal *
 **********/
export const minAnimalName = 1;
export const maxAnimalName = 50;
export const maxAnimalNote = 500;
export const maxBreedingNote = 500;
// 「サバイバルTypeScript > 配列から型を生成する」を参照

export const sexOptions = [
  { label: "未選択", value: "" },
  { label: i18n.t("male"), value: "male" },
  { label: i18n.t("female"), value: "female" },
] as const;
// typescript用
const sexValues = sexOptions.map((option) => option.value);
export type Sex = (typeof sexValues)[number];

export type Animal = {
  id: string;
  name: string;
  sex: Sex;
  breedingIdAsChild: string;
  breedingIdsAsParent: string[];
  note: string;
  folderIds: string[];
  createdAt: string;
  createdBy: string; // userId
  updatedAt: string;
  updatedBy: string; // userId
};

export type UserModifiableAnimalData = Omit<
  Animal,
  | "id"
  | "owner"
  | "visibility"
  | "createdAt"
  | "createdBy"
  | "updatedAt"
  | "updatedBy"
>;

export type AnimalFormData = Omit<
  UserModifiableAnimalData,
  "breedingIdAsChild" | "breedingIdsAsParent" | "folderIds"
>;

export type AnimalUpdateData = Partial<UserModifiableAnimalData>;

export type MiniAnimal = {
  id: string;
  name: string;
  sex: Sex;
};

/*************
 * Breeding *
 *************/
export const maxParents = 2;
export const maxChildren = 30;
// カレンダーのlengthは10か0
export const statusOptions = [
  { label: "未選択", value: "" },
  { label: i18n.t("planning"), value: "planning" },
  { label: i18n.t("ongoing"), value: "ongoing" },
  { label: i18n.t("done"), value: "done" },
] as const;
const statusValues = statusOptions.map((opt) => opt.value);
export type Status = (typeof statusValues)[number];

export type Breeding = {
  id: string;
  parents: MiniAnimal[];
  children: MiniAnimal[];
  status: Status;
  note: string;
  startDate: string;
  endDate: string;
  folderIds: string[];
  createdAt: string;
  createdBy: string; // userId
  updatedAt: string;
  updatedBy: string; // userId
};

export type UserModifiableBreedingData = Omit<
  Breeding,
  "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

export type BreedingFormData = Omit<UserModifiableBreedingData, "folderIds">;

export type BreedingUpdateData = Partial<UserModifiableBreedingData>;

export type MiniBreeding = {
  id: string;
  parents: MiniAnimal[];
  children: MiniAnimal[];
};

/********
 * User *
 ********/
export type User = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

/**********
 * Folder *
 **********/
export const maxFolderName = 50;
export const maxFolderNote = 500;
export const maxAccessUser = 100;

export type Folder = {
  id: string;
  name: string;
  itemIds: string[];
  note: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

export type UserModifiableFolderData = Omit<
  Folder,
  "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

export type FolderFormData = UserModifiableFolderData;

export type FolderUpdateData = Partial<UserModifiableFolderData>;

export type Share = "private" | "invitedUsers" | "public";

export const shareOptions: { label: string; value: Share }[] = [
  {
    label: i18n.t("private"),
    value: "private",
  },
  {
    label: i18n.t("invitedUsers"),
    value: "invitedUsers",
  },
  {
    label: i18n.t("public"),
    value: "public",
  },
];

// 未定
export type InvitedUser = {
  id: string;
  email: string;
};
