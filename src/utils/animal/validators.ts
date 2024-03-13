import {
  Animal,
  maxAnimalName,
  maxNote,
  minAnimalName
} from "../common/definitions";
import { findAnimalByName } from "./utils";

export const validateName = (name: string, allAnimals: Animal[]) => {
  if (findAnimalByName(name, allAnimals)) {
    return "同じ名前が既に使用されています";
  }
  if (name.length < minAnimalName || name.length > maxAnimalName) {
    return `名前は${minAnimalName}文字以上${maxAnimalName}文字以内で入力してください`;
  }
  return null;
};

export const validateNote = (note: string) => {
  if (note.length > maxNote) {
    return `メモは${maxNote}文字以内で入力してください`;
  }
  return null;
};
