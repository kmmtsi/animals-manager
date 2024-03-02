import { useState, useEffect } from "react";
import { auth } from "./utils/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { Sign } from "./components/sign/Sign";
import { AuthenticatedView } from "./components/authenticatedView/AuthenticatedView";
import { common } from "./utils/css";

export const App = () => {
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
    };
  }, []);

  return (
    // 共通CSSをここに記述する
    <div className={common}>
      {/* ユーザー検証中 */}
      {user === undefined && <div />}
      {/* ユーザー未ログイン */}
      {user === null && <Sign isDefaultSignIn={true} />}
      {/* ユーザーログイン */}
      {user && <AuthenticatedView user={user} />}
    </div>
  );
};
