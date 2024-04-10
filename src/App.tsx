import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastProvider } from "./components/generalUI/toast/ToastProvider";
import { common } from "./utils/css";
import { auth } from "./utils/firebase";

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
      <ToastProvider>
        <Outlet context={user} />
      </ToastProvider>
      <ScrollRestoration />
    </div>
  );
};
