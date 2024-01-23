import { Container } from "./components/generalUI/Container";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";
import { User } from "firebase/auth";
import { Sign } from "./components/sign/common/Sign";
import { Authenticated } from "./components/Authenticated";

export type createUserErr = string | null;

export const App = () => {
  /* Authenticationの確認 */
  // undefined: 初期値
  // null: 非認証
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
      console.log("Unsubscribe");
    };
  }, []);

  return (
    <>
      {user === undefined && (
        // ユーザー検証中
        <div></div>
      )}
      {user === null && (
        // ユーザー未ログイン
        <Sign />
      )}
      {user && (
        // ユーザーログイン時
        <Authenticated user={user} />
      )}
    </>
  );
};
