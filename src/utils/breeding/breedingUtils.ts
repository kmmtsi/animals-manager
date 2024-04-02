import { collection, getDocs } from "firebase/firestore";
import useSWR from "swr";
import i18n from "../../i18n/config";
import { Animal, Breeding, MiniAnimal } from "../common/definitions";
import { db } from "../firebase";

export const findBreedingById = (id: string, breedings: Breeding[]) =>
  breedings.find((breeding) => breeding.id === id);

export const getBreedingById = (id: string, breedings: Breeding[]) => {
  const breeding = findBreedingById(id, breedings);
  if (!breeding) {
    throw new Error(`${i18n.t("breedingNotFound")} (id: ${id})`);
  }
  return breeding;
};

export const isMemberIncluded = (
  memberToTest: MiniAnimal,
  members: MiniAnimal[]
) => members.some((member) => member.id === memberToTest.id);

export const isMembersSame = (
  members: MiniAnimal[],
  membersToTest: MiniAnimal[]
) => {
  if (members.length !== membersToTest.length) {
    return false;
  }
  return members.every((member) =>
    membersToTest.some((memberToTest) => memberToTest.id === member.id)
  );
};

export const getSuggestableMiniAnimals = (
  type: "parents" | "children",
  parents: MiniAnimal[],
  children: MiniAnimal[],
  allAnimals: Animal[]
): MiniAnimal[] => {
  const animals = allAnimals.filter((animal) => {
    return (
      // childrenのときは他のペアで未使用の動物のみ
      (type === "parents" ? true : animal.breedingIdAsChild === "") &&
      // breedingに未使用
      !parents.some((parent) => parent.id === animal.id) &&
      // childrenに未使用
      !children.some((child) => child.id === animal.id)
    );
  });
  return animals.map((animal) => ({
    id: animal.id,
    name: animal.name,
    sex: animal.sex,
  }));
};

// export const validateMembersNum = (
//   parents: MiniAnimal[],
//   children: MiniAnimal[]
// ) => {
//   const pL = parents.length;
//   const cL = children.length;

//   if (cL > maxChildren) {
//     return i18n.t("tooManyChildren");
//   } else if (pL === 0) {
//     if (cL === 0) {
//       return i18n.t("breedingIsEmpty");
//     } else if (cL === 1) {
//       // これにより兄弟関係か親子関係が成立する
//       return i18n.t("breedingNeedsOneMoreParentOrChild");
//     } else {
//       return null; // OK
//     }
//   } else if (pL === 1) {
//     if (cL === 0) {
//       return i18n.t("breedingNeedsOneMoreParentOrChild");
//     } else {
//       return null; // OK
//     }
//   } else if (pL === 2) {
//     return null; // OK
//   } else {
//     return i18n.t("tooManyParents");
//   }
// };

export const useFetchBreedings = (userId: string) => {
  const {
    data: allBreedings,
    isLoading: isLoadingBreedings,
    error: breedingsErr,
    mutate: breedingsMutator,
  } = useSWR(
    "breedings",
    async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "breedings")
        );
        const data = querySnapshot.docs.map((doc) => doc.data()) as Breeding[];
        return data;
      } catch (err) {
        throw new Error(i18n.t("dbReadErr"));
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    allBreedings,
    isLoadingBreedings,
    breedingsErr,
    breedingsMutator,
  };
};
