import { Animal } from "./definitions";
import { Breeding } from "./definitions";

export class FieldValidationErr extends Error {
  docId;
  // 後々フィールドごとに場所を出し分ける可能性があるのでfieldを持たせる
  field;
  constructor(
    docId: string,
    message: string,
    field?: keyof Animal | keyof Breeding
  ) {
    super(message);
    this.name = "FieldValidationErr";
    this.docId = docId;
    this.field = field;
  }
}

// export class NoChangeErr extends Error {
//   docId;
//   constructor(docId: string) {
//     super();
//     this.name = "NoChangeErr";
//     this.message = "変更がありません";
//     this.docId = docId;
//   }
// }

// export class DocValidationErr extends Error {
//   id; // 実際のidである必要はなくidentifierの意味
//   fieldValidationErrs;
//   NonFieldSpecificValidationErrs;
//   constructor(
//     id: string,
//     fieldValidationErrs: FieldValidationErr[],
//     NonFieldSpecificValidationErrs: NonFieldSpecificValidationErr[]
//   ) {
//     super();
//     this.name = "DocValidationErr";
//     this.id = id;
//     this.fieldValidationErrs = fieldValidationErrs;
//     this.NonFieldSpecificValidationErrs = NonFieldSpecificValidationErrs;
//   }
// }

// export const executeValidatorsForADoc = (
//   id: string, // documentの識別子（実際にidである必要はない）
//   validators: (() => void)[]
// ) => {
//   const fieldValidationErrs: FieldValidationErr[] = [];
//   const NonFieldSpecificValidationErrs: NonFieldSpecificValidationErr[] = [];

//   validators.forEach((validator) => {
//     try {
//       validator();
//     } catch (err) {
//       if (err instanceof FieldValidationErr) {
//         fieldValidationErrs.push(err);
//       } else if (err instanceof NonFieldSpecificValidationErr) {
//         NonFieldSpecificValidationErrs.push(err);
//       }
//     }
//   });

//   if (fieldValidationErrs.length || NonFieldSpecificValidationErrs.length) {
//     throw new DocValidationErr(
//       id,
//       fieldValidationErrs,
//       NonFieldSpecificValidationErrs
//     );
//   }
// };

/**
 * Idのインスペクション
 * @param id
 * @param docId
 * @returns
 */
export const inspectId = (id: string, docId: string) => {
  if (id !== docId) {
    throw new FieldValidationErr("id", "IDが不正です");
  }
};

/**
 * Timestampが24文字か27文字
 * @param createdAt
 * @returns
 */
export const inspectTimestamp = (
  field: "createdAt" | "updatedAt",
  timestamp: string
) => {
  if (timestamp.length !== 24 && timestamp.length !== 27) {
    throw new FieldValidationErr(field, "日時が不正です");
  }
};

export const inspectModifier = (
  field: "createdBy" | "updatedBy",
  modifier: string,
  userId: string
) => {
  if (modifier !== userId) {
    throw new FieldValidationErr(field, "ユーザーIDが不正です");
  }
};

/**
 * DocValidationErrをUI用にフォーマット
 * @param docValidationErr
 * @returns
 */
// export const formatDocValidationErr = (docValidationErr: DocValidationErr) => {
//   const docId = docValidationErr.id;

//   const fieldValidationErrs = docValidationErr.fieldValidationErrs;
//   const nonFieldSpecificValidationErrs =
//     docValidationErr.NonFieldSpecificValidationErrs;

//   const fieldValidationErrMsgs = fieldValidationErrs.map(
//     (fieldValidationErr) => {
//       const field = fieldValidationErr.field;
//       const msg = fieldValidationErr.message;
//       return `${docId} > ${field} > ${msg}`;
//     }
//   );
//   const nonFieldSpecificValidationErrMsgs = nonFieldSpecificValidationErrs.map(
//     (nonFieldSpecificValidationErr) => {
//       return `${docId} > ${nonFieldSpecificValidationErr.message}`;
//     }
//   );

//   return [...fieldValidationErrMsgs, ...nonFieldSpecificValidationErrMsgs];
// };
