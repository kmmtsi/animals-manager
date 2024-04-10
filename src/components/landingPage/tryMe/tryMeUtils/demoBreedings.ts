import { Breeding } from "../../../../utils/common/definitions";
import { demoTimestamp, demoUserId } from "./tryMeUtils";
import {
  harringtonsId,
  miniKaren,
  miniMike,
  miniNancy,
  miniSteve,
  miniTed,
  wheelersId,
} from "./sharedData";

/****************
 *** Breeding ***
 ****************/

export type BreedingCommonData = Omit<
  Breeding,
  "folderIds" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;

const wheelers: BreedingCommonData = {
  id: wheelersId,
  parents: [miniTed, miniKaren],
  children: [miniMike, miniNancy],
  status: "done",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  note: "",
};

const harringtons: BreedingCommonData = {
  id: harringtonsId,
  parents: [miniSteve, miniNancy],
  children: [],
  status: "planning",
  startDate: "",
  endDate: "",
  note: "",
};

const demoBreedingsData: BreedingCommonData[] = [wheelers, harringtons];

export const getDemoBreedings = (): Breeding[] =>
  demoBreedingsData.map((data) => ({
    ...data,
    folderIds: [],
    createdAt: demoTimestamp,
    createdBy: demoUserId,
    updatedAt: demoTimestamp,
    updatedBy: demoUserId,
  }));
