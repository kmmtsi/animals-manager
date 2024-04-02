import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPathToAnimals,
  getPathToSignUp,
} from "../../utils/common/pageUtils";
import { sign } from "../../utils/css";
import { NewMsg } from "../generalUI/NewMsg";
import { Logo } from "../generalUI/logo/Logo";
import { SignForm } from "./SignForm";
import { getSignErrMsg, signInUser } from "./signUtils";

export const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const text = t("signIn");
  // AuthedPage.tsxから渡ってくる
  const originPath = useLocation().state as string | null;

  const [errMsg, setErrMsg] = useState<string | null>(null);

  return (
    // max-widthを指定しているのでcontainer不要
    <div className={sign}>
      <div className="flex flex-col items-center gap-y-2">
        <Logo isLink={false} />
        <h2 className="font-bold">{text}</h2>
      </div>
      {/* エラーメッセージ */}
      {errMsg && (
        <NewMsg role="err" className="w-full">
          {errMsg}
        </NewMsg>
      )}
      {/* フォーム */}
      <div className="w-full border rounded p-6">
        <SignForm
          btnText={text}
          pwAutoComplete={"current-password"}
          formOperation={async (data) => {
            setErrMsg(null);
            try {
              await signInUser(data);
              // ログイン後に元のページにリダイレクト
              navigate(originPath ?? getPathToAnimals());
            } catch (err) {
              setErrMsg(getSignErrMsg(err));
            }
          }}
        />
      </div>
      {/* 新規登録, ログイン切り替えボタン */}
      <button
        type="button"
        onClick={() => navigate(getPathToSignUp())}
        className="w-fit text-slate-500 mx-auto"
      >
        {t("goToX", {
          x: t("signUp"),
        })}
      </button>
    </div>
  );
};
