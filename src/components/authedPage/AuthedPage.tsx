import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { getPathToSignIn } from "../../utils/common/pageUtils";
import { container, zAuthedMain } from "../../utils/css";
import { AuthedHeader } from "./AuthedHeader";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";

export type State = string | null;
export type CloseNav = () => void;

export const AuthedPage = () => {
  const user = useOutletContext<User | null | undefined>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (user === null) {
      // ログインページへリダイレクト
      navigate(getPathToSignIn(), { state: pathname as State });
    }
  }, [user, navigate, pathname]);

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const openNav = () => setIsNavOpen(true);
  const closeNav: CloseNav = () => setIsNavOpen(false);

  if (user) {
    return (
      <div className="flex flex-col min-h-svh">
        <AuthedHeader openNav={openNav} />
        <div className={`grid grid-cols-12 ${container}`}>
          <Sidebar isNavOpen={isNavOpen} closeNav={closeNav} />
          <main
            className={`col-span-12 lg:col-span-10 lg:px-4 pt-4 pb-20 ${zAuthedMain.main}`}
          >
            {/* outlet */}
            <Outlet context={user} />
          </main>
        </div>
        <Footer />
      </div>
    );
  }
};
