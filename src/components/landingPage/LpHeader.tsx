import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  getPathToHome,
  getPathToSignIn,
  getPathToSignUp,
} from "../../utils/common/pageUtils";
import { btn, btnBlue, btnTextOnly, container, hover } from "../../utils/css";
import { Logo } from "../generalUI/logo/Logo";

export const LpHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="border-b h-16 sticky flex items-center">
      <div className={`flex items-center justify-between ${container}`}>
        <Logo options={{ linkTo: getPathToHome() }} />
        {/* 右側エリア */}
        <div className="flex gap-x-1 sm:gap-2">
          {/* ログイン */}
          <Link
            to={getPathToSignIn()}
            className={`${btn} ${btnTextOnly} ${hover}`}
          >
            {t("signIn")}
          </Link>
          {/* 新規登録 */}
          <Link to={getPathToSignUp()} className={`${btn} ${btnBlue} flex items-center`}>
            {t("register")}
          </Link>
        </div>
      </div>
    </header>
  );
};
