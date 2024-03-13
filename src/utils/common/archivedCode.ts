// export const validateName = (name: string, allAnimals: Animal[]) => {
//   if (findAnimalByName(name, allAnimals)) {
//     throw new FieldValidationErr(
//       name,
//       "同じ名前が既に使用されています",
//       "name"
//     );
//   }
//   if (name.length < minAnimalName || name.length > maxAnimalName) {
//     throw new FieldValidationErr(
//       name,
//       `${minAnimalName}文字以上${maxAnimalName}文字以内で入力してください`,
//       "name"
//     );
//   }
// };

// const validateSourcePair = (
//   name: string,
//   sourcePair: string,
// ) => {
//   //
// };

// export const validateSelfPairs = (name: string, selfPairs: string[]) => {
//     if (selfPairs.length > maxSelfPairs) {
//       throw new FieldValidationErr(
//         name,
//         `selfPairsの数は${maxSelfPairs}以下に設定してください`,
//         "selfPairs"
//       );
//     }
//   };

// export const validateNote = (name: string, note: string) => {
//   if (note.length > maxNote) {
//     throw new FieldValidationErr(
//       name,
//       `メモは${maxNote}文字以内で入力してください`,
//       "note"
//     );
//   }
// };

// export type ValidatableAnimalField =
//   | "name"
//   | "sex"
//   | "sourcePair"
//   | "selfPairs"
//   | "note";
// /**
//  * 与えられたフィールドについてのみバリデーションを実行する
//  * @param data
//  * @param allAnimals
//  * @param allBaseAnimals
//  */
// export const validateAnimal = (
//   animal: Animal,
//   allAnimals: Animal[],
//   fieldsToValidate: ValidatableAnimalField[]
// ) => {
//   const { name, sex, sourcePair, selfPairs, note } = animal;

//   // フィールド名とそれに対応するバリデーター
//   const fieldAndValidator = {
//     name: () => validateName(name, allAnimals),
//     sex: () => validateSex(name, sex),
//     sourcePair: () => validateSourcePair(name, sourcePair),
//     selfPairs: () => validateSelfPairs(name, selfPairs),
//     note: () => validateNote(name, note),
//   };

//   // 実行するバリデーターを格納する配列
//   const validators: (() => void)[] = [];

//   // 与えられたフィールド名から実行するバリデーションを取得
//   fieldsToValidate.forEach((field) => {
//     validators.push(fieldAndValidator[field]);
//   });

//   validators.forEach((validator) => validator());
// };

// export const cuAnimalsModifiedByPair = (
//   pair: MiniPair,
//   prevPair: MiniPair | undefined,
//   userId: string,
//   batch: WriteBatch,
//   copiedAllAnimals: Animal[]
// ) => {
//   const pairId = pair.id;

//   // pairedAnimalsに対する処理
//   coreFunc("pairedAnimals", pair.pairedAnimals, prevPair?.pairedAnimals);

//   // childrenに対する処理
//   coreFunc("children", pair.children, prevPair?.children);

//   function coreFunc(
//     type: "pairedAnimals" | "children",
//     miniAnimals: MiniAnimal[],
//     prevMiniAnimals: MiniAnimal[] | undefined
//   ) {
//     miniAnimals.forEach((miniAnimal) => {
//       const prevAnimal = findAnimalById(miniAnimal.id, copiedAllAnimals);

//       if (!prevAnimal) {
//         // 新規動物の場合
//         cuAnimal(
//           {
//             id: miniAnimal.id,
//             name: miniAnimal.name,
//             sourcePair: type === "children" ? pairId : undefined,
//             selfPairs: type === "pairedAnimals" ? [pairId] : undefined,
//           },
//           userId,
//           batch,
//           copiedAllAnimals
//         );
//       } else {
//         // 既存動物の場合
//         updateAnimal(
//           {
//             sourcePair: type === "children" ? pairId : undefined,
//             selfPairs:
//               type === "pairedAnimals"
//                 ? [...prevAnimal.selfPairs, pairId]
//                 : undefined,
//           },
//           prevAnimal,
//           userId,
//           batch,
//           copiedAllAnimals
//         );
//       }
//     });

//     prevMiniAnimals?.forEach((prevMiniAnimal) => {
//       const id = prevMiniAnimal.id;
//       const animalFound = miniAnimals.find(
//         (miniAnimal) => miniAnimal.id === id
//       );
//       if (!animalFound) {
//         const animalToUpdate = getAnimalById(id, copiedAllAnimals);
//         const data =
//           type === "pairedAnimals"
//             ? {
//                 sourcePair: undefined,
//                 selfPairs: animalToUpdate.selfPairs.filter((i) => i !== pairId),
//               }
//             : {
//                 sourcePair: "",
//                 selfPairs: undefined,
//               };
//         updateAnimal(data, animalToUpdate, userId, batch, copiedAllAnimals);
//       }
//     });
//   }
// };

// export const validatePairsDuplication = (
//   id: string,
//   pairedAnimals: MiniAnimal[],
//   children: MiniAnimal[],
//   allPairs: Pair[]
// ) => {
//   // 同じpairedAnimalsとchildrenの組み合わせを持つpairが存在するか
//   allPairs.some((pair) => {
//     const pairedAnimalsToTest = pair.pairedAnimals;
//     const childrenToTest = pair.children;
//     if (
//       isMembersSame(pairedAnimals, pairedAnimalsToTest) &&
//       isMembersSame(children, childrenToTest)
//     ) {
//       throw new FieldValidationErr(id, "同じ組み合わせのペアが既に存在します");
//     }
//   });
// };

// export type ValidatablePairField = "pairedAnimals" | "children";

// // TODO: Duplicationのチェック大変そうなのでエラー出た瞬間やめてもいいかも
// export const validatePair = (
//   pair: Pair,
//   fieldsToValidate: ValidatablePairField[],
//   allPairs: Pair[]
// ) => {
//   const { id, pairedAnimals, children } = pair;

//   // update時に何も変更がない場合
//   if (fieldsToValidate.length === 0)
//     throw new FieldValidationErr(id, "変更がありません");

//   // フィールド名とそれに対応するバリデーター
//   const fieldAndValidator = {
//     pairedAnimals: () =>
//       validateMemberNums(id, "pairedAnimals", pairedAnimals.length),
//     children: () => validateMemberNums(id, "children", children.length),
//   };

//   // 実行するバリデーターを格納する配列
//   const validators = [
//     () => validatePairNotEmpty(id, pairedAnimals, children),
//     () => validateDuplicationInPair(id, pairedAnimals, children),
//     () => validatePairDuplication(id, pairedAnimals, children, allPairs),
//   ];

//   // 与えられたフィールド名から実行するバリデーションを取得
//   fieldsToValidate.forEach((field) => {
//     validators.push(fieldAndValidator[field]);
//   });

//   validators.forEach((validator) => validator());

//   // executeValidatorsForADoc(pair.id, validators);
// };


// /**
//  * ownerIdがuserのid
//  * @param ownerId
//  * @param userId
//  * @returns
//  */
// const inspectOwnerId = (ownerId: string, userId: string) => {
//   if (ownerId !== userId) {
//     throw new FieldValidationErr("ownerId", ["ownerIdが不正です"]);
//   }
// };

// /**
//  * visibilityがtype Visibilityのどれか
//  * @param visibility
//  * @returns
//  */
// const inspectVisibility = (visibility: string) => {
//   if (visibility !== "private") {
//     throw new FieldValidationErr("visibility", ["公開設定が不正です"]);
//   }
// };


// const inspectAnimal = (
//   animal: Animal,
//   allAnimals: Animal[],
//   userId: string,
//   docId: string
// ) => {
//   const validators = [
//     () => inspectId(animal.id, docId),
//     // validateNameではなくinspectNameを実行
//     () => inspectName(animal.name, allAnimals),
//     () => validateSex(animal.sex),
//     () => validateFamily("parents", animal.id, animal.parents, animal.children),
//     () =>
//       validateFamily("children", animal.id, animal.children, animal.parents),
//     () => inspectFamilyLink("parents", animal.id, animal.parents, allAnimals),
//     () => inspectFamilyLink("children", animal.id, animal.children, allAnimals),
//     () => validateNote(animal.note),
//     () => inspectOwnerId(animal.ownerId, userId),
//     () => inspectVisibility(animal.visibility),
//     () => inspectTimestamp("createdAt", animal.createdAt),
//     () => inspectTimestamp("updatedAt", animal.createdAt),
//     () => inspectModifier("createdBy", animal.createdBy, userId),
//     () => inspectModifier("updatedBy", animal.updatedBy, userId),
//   ];

//   executeValidatorsForADoc(animal.name, validators);
// };

// export const inspectAnimals = (
//   allAnimals: Animal[],
//   docIds: string[],
//   userId: string
// ) => {
//   const animalValidationErrs: AnimalValidationErr[] = [];
//   allAnimals.forEach((animal, i) => {
//     try {
//       inspectAnimal(animal, allAnimals, userId, docIds[i]);
//     } catch (err) {
//       if (err instanceof AnimalValidationErr) {
//         animalValidationErrs.push(err);
//       }
//     }
//   });
//   if (animalValidationErrs.length) {
//     throw new AnimalsValidationErr(animalValidationErrs);
//   }
// };

// AnimalValidationErrをまとめる
// export class AnimalsValidationErr extends Error {
//   animalValidationErrs: AnimalValidationErr[];
//   constructor(animalValidationErrs: AnimalValidationErr[]) {
//     super("データベース内に不正なデータが存在します");
//     this.name = "AnimalsValidationErr";
//     this.animalValidationErrs = animalValidationErrs;
//   }
// }


// // 変更されたmemberを取得
// export type ClassifiedMembers = {
//   unchangedMembers: string[]; // 変更されていない動物
//   addedNewMembers: MiniAnimal[]; // 新規動物
//   addedExistingMembers: string[]; // 新たに追加された既存動物
//   removedMembers: string[]; // 新たに除外された動物
// };
/**
//  * Familyのメンバーを4種類に分類
//  * @param currentMiniFamily
//  * @param prevFamily
//  * @param animals
//  * @returns
//  */
// export const classifyMembers = (
//   currentMiniFamily: MiniAnimal[],
//   prevFamily: string[]
// ) => {
//   const classifiedMembers: ClassifiedMembers = {
//     unchangedMembers: [],
//     addedNewMembers: [],
//     addedExistingMembers: [],
//     removedMembers: [],
//   };

//   currentMiniFamily.forEach((currentMember) => {
//     if (currentMember.id === "") {
//       // 新規動物
//       classifiedMembers.addedNewMembers.push(currentMember);
//     } else {
//       // 新規動物以外
//       if (prevFamily.includes(currentMember.id)) {
//         // 以前からメンバーとして存在している
//         classifiedMembers.unchangedMembers.push(currentMember.id);
//       } else {
//         // 以前のメンバーとして存在していない
//         // 新たに追加された既存動物
//         classifiedMembers.addedExistingMembers.push(currentMember.id);
//       }
//     }
//   });
//   prevFamily.forEach((prevMember) => {
//     if (!findAnimalById(prevMember, currentMiniFamily)) {
//       // 新たなfamilyに含まれていない -> 除外された
//       classifiedMembers.removedMembers.push(prevMember);
//     }
//   });
//   return classifiedMembers;
// };