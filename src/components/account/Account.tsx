import { User, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import {
  btn,
  btnBlue,
  fieldGapY,
  infoBox,
  pageGapY,
  pageTitle,
} from "../../utils/css";
import { auth } from "../../utils/firebase";
import { useFetchUser } from "../../utils/user/userUtils";
import { Breadcrumb } from "../generalUI/Breadcrumb";
import { Msg } from "../generalUI/Msg";

export const Account = () => {
  const authUser = useOutletContext<User>();
  const { t } = useTranslation();
  const { user, userErr } = useFetchUser(authUser.uid);

  if (user) {
    return (
      <div className={pageGapY}>
        <Breadcrumb page={"account"} />
        <h1 className={pageTitle}>{t("account")}</h1>
        <div className="space-y-6">
          {/* username */}
          <div className={fieldGapY}>
            <div>{t("username")}</div>
            <div className={infoBox}>{user.username}</div>
          </div>
          {/* メールアドレス */}
          <div className={fieldGapY}>
            <div>{t("email")}</div>
            <div className={infoBox}>{authUser.email}</div>
          </div>
          {/* ログアウト */}
          <div className={fieldGapY}>
            <div>{t("logout")}</div>
            <button
              onClick={async () => {
                await signOut(auth);
              }}
              className={`${btn} ${btnBlue} w-fit`}
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (userErr) {
    return <Msg role="err">{userErr.message}</Msg>;
  }
};
