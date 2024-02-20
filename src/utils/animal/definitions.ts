export const maxParents = 2;
export const maxChildren = 30;
export const minLengthForAnimalName = 1;
export const maxLengthForAnimalName = 30;
export const maxLengthForNote = 500;

export const sexOptions = [
  { label: "未入力", value: "" },
  { label: "オス", value: "male" },
  { label: "メス", value: "female" },
] as const; // 「サバイバルTypeScript > 配列から型を生成する」を参照

const sexValues = sexOptions.map((option) => option.value);

export type Sex = (typeof sexValues)[number];
export type Visibility = "private"; // publicは後に実装
export type BaseAnimal = {
  id: string;
  name: string;
  sex: Sex;
};
export type Parent = BaseAnimal;
export type Child = BaseAnimal;
export type Animal = {
  id: string;
  name: string;
  sex: Sex;
  parents: Parent[];
  children: Child[];
  note: string;
  ownerId: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};
// export type updatableFields = {
//   name?: string;
//   sex?: Sex;
//   parents?: Parent[];
//   children?: Child[];
//   note?: string;
//   updatedAt: string;
// };


// バリデーション内容
// ========== field ==========
// [ create 】
// 全て必須（✅rule）
// それ以上でも以下でもない（✅rule）

// ========== id ==========
// [ create 】
// 必須
// 文字列
// documentIDと一致（＝collection間で一意）（✅rule）

// [ update ]
// 不許可（✅rule）

// ========== name ==========
// [ create ]
// 必須（✅HTML, ✅rule）
// 30文字以内の文字列（✅HTML, ✅rule）
// collection間で一意（✅バリデ）
// parentsの要素のnameとの重複NG（✅バリデ, ✅parentsに委託）
// childrenの要素のnameとの重複NG（✅バリデ, ✅childrenに委託）

// [ update ]
// 許可（✅rule）
// 前回と同じ値の場合は変更不可（必要？）

// ========== sex ==========
// [ create ]
// type Sexで規定している値のみ（✅select, ✅rule）

// [ update ]
// 許可（✅rule）
// 前回と同じ値の場合は変更不可（必要？）

// ========== parents ==========
// [ create ]
// 0以上2以下の配列（✅ComboUI, ✅rule）
// 配列内要素：id, name, sexプロパティを持つオブジェクト
// idプロパティ：バリデなし（ユーザー入力なし）
// idプロパティ：collection間で一意（✅DB書き込み時ロジック）
// nameプロパティ：1文字以上30文字以内の文字列（✅ComboUI, ✅バリデ）
// nameプロパティ：collection間で一意（✅DB書き込み時ロジック）
// nameプロパティ：自分のnameとの重複NG（✅ComboUI, ✅nameに委託）
// nameプロパティ：parents間で重複不可（✅ComboUI, ✅バリデ）
// nameプロパティ：childenの要素のnameとの重複NG（✅ComboUI、✅バリデ）
// sexプロパティ：バリデなし（現在ユーザー入力なし）
// 既存の動物から選択するか新規の動物を入力する
// 配列の要素のnameが既存の動物のnameと一致する時 -> 一致する動物のchildrenに自分を追加しupdateする
// 配列の要素のnameが既存の動物のnameと一致しないとき -> 新しい動物を作成し、その動物のchildrenに自分を追加しcreateする

// [ update ]
// 許可（✅rule）
// 要件はcreate時と同じ
// 追加：追加された動物のchildrenに自分を追加
// 削除：追加された動物のchildrenから自分を削除
// [ parentsに設定済みの動物のchildrenから削除された場合 ]
// parentsから削除
// [ parentsに設定済みの動物が削除された場合 ]
// parentsから削除

// ========== children ==========
// [ create 】
// 0以上maxChildren以下の配列（✅ComboUI, ✅rule）
// 配列内要素：id, name, sexプロパティを持つオブジェクト
// idプロパティ：バリデなし（ユーザー入力なし）
// idプロパティ：collection間で一意（✅DB書き込み時ロジック）
// nameプロパティ：1文字以上30文字以内の文字列（✅ComboUI, ✅バリデ）
// nameプロパティ：collection間で一意（✅DB書き込み時ロジック）
// nameプロパティ：自分のnameとの重複NG（✅ComboUI, ✅nameに委託）
// nameプロパティ：parentsの要素のnameとの重複NG（✅ComboUI, ✅バリデ）
// nameプロパティ：children間で重複不可（✅ComboUI, ✅バリデ）
// sexプロパティ：バリデなし（現在ユーザー入力なし）
// 既存の動物から選択するか新規の動物を入力する
// 配列の要素のnameが既存の動物のnameと一致する時 -> 一致する動物のparentsに自分を追加しupdateする
// 配列の要素のnameが既存の動物のnameと一致しないとき -> 新しい動物を作成し、その動物のparentsに自分を追加しcreateする

// [ update ]
// 許可（✅rule）
// 要件はcreate時と同じ
// 追加：追加された動物のparentsに自分を追加
// 削除：追加された動物のparentsから自分を削除
// [ childrenに設定済みの動物のparentsから削除された場合 ]
// childrenから削除
// [ parentsに設定済みの動物が削除された場合 ]
// childrenから削除

// ========== note ==========
// [ create 】
// 500文字以内の文字列（✅HTML, ✅rule）

// [ update ]
// 許可（✅rule）
// 要件はcreate時と同じ

// ========== ownerId ==========
// [ create 】
// 現時点ではユーザー入力はなし
// 必須（✅rule）
// idと同じ形式
// 自分のuserIdと一致（現在）（✅rule）

// [ update ]
// 不許可（現在）（✅rule）

// ========== visibility ==========
// [ create 】
// 現時点ではユーザー入力はなし
// 必須（✅rule）
// "private"のみ（現在）（✅rule）

// [ update ]
// 不許可（現在）（✅rule）

// ========== createdAt ==========
// [ create 】
// 必須（✅rule）
// timestamp（✅rule）
// ユーザー入力なし

// [ update ]
// 不許可（✅rule）

// ========== updatedAt ==========
// [ create 】
// 必須（✅rule）
// timestamp（✅rule）
// ユーザー入力なし

// [ update ]
// 必須（✅rule）
