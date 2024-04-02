import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import useSWR from "swr";
import i18n from "../../i18n/config";
import { User } from "../common/definitions";
import { db } from "../firebase";

export const useFetchUser = (userId: string) => {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userErr,
  } = useSWR(
    "user",
    async () => {
      try {
        const document = await getDoc(doc(db, "users", userId));
        const data = document.data();
        if (data) {
          return data as User;
        } else {
          // userが作成されていない場合
          throw new Error(i18n.t("noUserCreated"));
        }
      } catch (err) {
        if (err instanceof FirebaseError) {
          throw new Error(i18n.t("dbReadErr"));
        } else if (err instanceof Error) {
          throw err;
        }
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return { user, isLoadingUser, userErr };
};
