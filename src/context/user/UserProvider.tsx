// import { useState, useEffect, ReactNode } from "react";
// import { auth } from "../../utils/firebase";
// import { User, onAuthStateChanged } from "firebase/auth";
// import { UserContext } from "./UserContext";

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null | undefined>(undefined);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // User is signed in
//         setUser(user);
//       } else {
//         // User is signed out
//         setUser(null);
//       }
//     });
//     return () => {
//       unsubscribe();
//       console.log("Unsubscribe");
//     };
//   }, []);
//   return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
// };
