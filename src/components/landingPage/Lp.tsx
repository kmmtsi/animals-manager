import { User } from "firebase/auth";
import { Outlet, useOutletContext } from "react-router-dom";
import { Footer } from "../authedPage/Footer";
import { LpHeader } from "./LpHeader";

export const Lp = () => {
  const authUser = useOutletContext<User | null | undefined>();

  return (
    <div className="min-h-screen flex flex-col">
      <LpHeader />
      <main className="py-10">
        <Outlet context={authUser} />
      </main>
      <Footer />
    </div>
  );
};
