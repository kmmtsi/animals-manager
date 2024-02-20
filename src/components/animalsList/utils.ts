import { Animal } from "../../utils/animal/definitions";

export const getSortedAnimals = (
  animals: Animal[],
  target: "name" | "createdAt" | "updatedAt",
  order: "asc" | "desc"
) => {
  switch (target) {
    case "name":
      // 名前でソートした配列を返す
      return animals.sort((a, b) => {
        if (order === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
    case "createdAt":
    case "updatedAt":
      // createdAtもしくはupdatedAtでソートした配列を返す
      return animals.sort((a, b) => {
        if (order === "asc") {
          return Date.parse(a[target]) - Date.parse(b[target]);
        } else {
          return Date.parse(b[target]) - Date.parse(a[target]);
        }
      });
  }
};
