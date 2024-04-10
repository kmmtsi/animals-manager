import { User } from "firebase/auth";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getPathToAllAnimals } from "../../utils/common/pageUtils";
import { Msg } from "../generalUI/Msg";

export type SignErrMsg = string | null;

export const Sign = ({
  title,
  errMsg,
  children,
  switchBtnConfig,
}: {
  title: string;
  errMsg: SignErrMsg;
  children: ReactNode;
  switchBtnConfig: {
    label: string;
    path: string;
  };
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authUser = useOutletContext<User | null | undefined>();

  useEffect(() => {
    if (authUser) {
      // ログイン済みの場合はリダイレクト
      navigate(getPathToAllAnimals());
    }
  }, [authUser, navigate]);

  if (authUser === null) {
    // userが確実に未ログインの場合のみ表示
    return (
      // max-widthを指定しているのでcontainer不要
      <div className="flex flex-col items-center justify-center gap-y-6 mx-auto px-2 max-w-80">
        <h2 className="text-xl font-semibold">{t(title)}</h2>
        {/* エラーメッセージ */}
        {errMsg && (
          <Msg role="err" className="w-full">
            {errMsg}
          </Msg>
        )}
        {/* フォーム */}
        <div className="w-full border rounded p-6"> {children}</div>
        {/* 新規登録, ログイン切り替えボタン */}
        <button
          type="button"
          onClick={() => navigate(switchBtnConfig.path)}
          className="w-fit text-slate-500 mx-auto"
        >
          {t("goToX", {
            x: t(switchBtnConfig.label),
          })}
        </button>
      </div>
    );
  }
};
