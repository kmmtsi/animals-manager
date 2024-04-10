export const demoUserId = "demoUserId";
export const demoTimestamp = "2024-04-01T07:42:48.039Z";

export const demoWindows = [
  "createAnimal",
  "allAnimals",
  "animalPage",
  "createBreeding",
  "allBreedings",
  "breedingPage",
] as const;

export type DemoWindow = (typeof demoWindows)[number];
