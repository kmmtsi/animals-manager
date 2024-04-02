import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../common/definitions";
import { getTimestamp } from "../common/commonUtils";

export const createUser = async (userId: string, email: string) => {
  const user: User = {
    id: userId,
    email,
    username: "",
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };
  await setDoc(doc(db, "users", userId), user);
};
