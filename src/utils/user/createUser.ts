import { doc, setDoc } from "firebase/firestore";
import { getTimestamp } from "../common/commonUtils";
import { User } from "../common/definitions";
import { db } from "../firebase";

export const createUser = async (userId: string, email: string) => {
  const user: User = {
    id: userId,
    email,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };
  await setDoc(doc(db, "users", userId), user);
};
