/**********
 * Animal *
 **********/
export const minAnimalName = 1;
export const maxAnimalName = 50;
export const maxAnimalNote = 500;

export const sexOptions = [
  { label: "notSelected", value: "" },
  { label: "male", value: "male" },
  { label: "female", value: "female" },
] as const;

const sexValues = sexOptions.map((option) => option.value);

export type SexValue = (typeof sexValues)[number];

export const healthConditionOptions = [
  { label: "notSelected", value: "" },
  { label: "healthy", value: "healthy" },
  { label: "sick", value: "sick" },
  { label: "injured", value: "injured" },
  { label: "dead", value: "dead" },
] as const;

const healthConditionLabels = healthConditionOptions.map(
  (option) => option.label
);
const healthConditionValues = healthConditionOptions.map(
  (option) => option.value
);

export type HealthConditionLabel = (typeof healthConditionLabels)[number];
export type HealthConditionValue = (typeof healthConditionValues)[number];

export type Animal = {
  id: string;
  name: string;
  sex: SexValue;
  breedingIdAsChild: string;
  breedingIdsAsParent: string[];
  healthCondition: HealthConditionValue;
  dateOfBirth: string;
  note: string;
  folderIds: string[];
  createdAt: string;
  createdBy: string; // userId
  updatedAt: string;
  updatedBy: string; // userId
};

export type UserModifiableAnimalData = Omit<
  Animal,
  "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

export type AnimalFormData = Omit<
  UserModifiableAnimalData,
  "breedingIdAsChild" | "breedingIdsAsParent" | "folderIds"
>;

export type AnimalUpdateData = Partial<UserModifiableAnimalData>;

export type MiniAnimal = {
  id: string;
  name: string;
  sex: SexValue;
};

/*************
 * Breeding *
 *************/
export const maxParents = 2;
export const maxChildren = 100;
export const maxBreedingNote = maxAnimalNote;

// カレンダーのlengthは10か0
export const statusOptions = [
  { label: "notSelected", value: "" },
  { label: "planning", value: "planning" },
  { label: "ongoing", value: "ongoing" },
  { label: "done", value: "done" },
] as const;

const statusLabels = statusOptions.map((opt) => opt.label);
const statusValues = statusOptions.map((opt) => opt.value);

export type StatusLabel = (typeof statusLabels)[number];
export type StatusValue = (typeof statusValues)[number];

export type Breeding = {
  id: string;
  parents: MiniAnimal[];
  children: MiniAnimal[];
  status: StatusValue;
  startDate: string;
  endDate: string;
  note: string;
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
  createdAt: string;
  updatedAt: string;
};

/**********
 * Folder *
 **********/
export const maxFolderName = 50;
export const maxFolderNote = maxAnimalNote;

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

// export type Share = "private" | "invitedUsers" | "public";

// export const shareOptions: { label: string; value: Share }[] = [
//   {
//     label: i18n.t("private"),
//     value: "private",
//   },
//   {
//     label: i18n.t("invitedUsers"),
//     value: "invitedUsers",
//   },
//   {
//     label: i18n.t("public"),
//     value: "public",
//   },
// ];

// // 未定
// export type InvitedUser = {
//   id: string;
//   email: string;
// };
