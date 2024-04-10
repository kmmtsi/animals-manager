import { Animal } from "../../../../utils/common/definitions";
import {
  harringtonsId,
  miniKaren,
  miniMike,
  miniNancy,
  miniSteve,
  miniTed,
  wheelersId,
} from "./sharedData";
import { demoTimestamp, demoUserId } from "./tryMeUtils";

export type AnimalCommonData = Omit<
  Animal,
  "folderIds" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

const mike: AnimalCommonData = {
  ...miniMike,
  breedingIdAsChild: wheelersId,
  breedingIdsAsParent: [],
  healthCondition: "healthy",
  dateOfBirth: "2024-03-27",
  note: "",
};

const ted: AnimalCommonData = {
  ...miniTed,
  breedingIdAsChild: "",
  breedingIdsAsParent: [wheelersId],
  healthCondition: "healthy",
  dateOfBirth: "2018-04-02",
  note: "",
};

const karen: AnimalCommonData = {
  ...miniKaren,
  breedingIdAsChild: "",
  breedingIdsAsParent: [wheelersId],
  healthCondition: "healthy",
  dateOfBirth: "2019-11-15",
  note: "",
};

const nancy: AnimalCommonData = {
  ...miniNancy,
  breedingIdAsChild: wheelersId,
  breedingIdsAsParent: [harringtonsId],
  healthCondition: "healthy",
  dateOfBirth: "2022-01-02",
  note: "",
};

// const dustin: AnimalCommonData = {
//   id: "dustin",
//   name: "Dustin",
//   sex: "male",
//   breedingIdAsChild: "",
//   breedingIdsAsParent: [],
//   healthCondition: "healthy",
//   dateOfBirth: "2023-05-29",
//   note: "",
// };

const steve: AnimalCommonData = {
  ...miniSteve,
  breedingIdAsChild: "",
  breedingIdsAsParent: [harringtonsId],
  healthCondition: "healthy",
  dateOfBirth: "2020-08-11",
  note: "",
};

const max: AnimalCommonData = {
  id: "max",
  name: "Max",
  sex: "female",
  breedingIdAsChild: "",
  breedingIdsAsParent: [],
  healthCondition: "injured",
  dateOfBirth: "2022-03-27",
  note: "",
};

const eddie: AnimalCommonData = {
  id: "eddie",
  name: "Eddie",
  sex: "male",
  breedingIdAsChild: "",
  breedingIdsAsParent: [],
  healthCondition: "dead",
  dateOfBirth: "2020-03-10",
  note: "",
};

const demoAnimalsCommonData: AnimalCommonData[] = [
  mike,
  steve,
  max,
  ted,
  karen,
  nancy,
  eddie,
];

export const getDemoAnimals = (): Animal[] =>
  demoAnimalsCommonData.map((data) => ({
    ...data,
    folderIds: [],
    createdAt: demoTimestamp,
    createdBy: demoUserId,
    updatedAt: demoTimestamp,
    updatedBy: demoUserId,
  }));
