import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPathToAllAnimals,
  getPathToSignUp,
} from "../../utils/common/pageUtils";
import { State } from "../authedPage/AuthedPage";
import { Sign, SignErrMsg } from "./Sign";
import { SignForm } from "./SignForm";
import { getSignErrMsg, signInUser } from "./signUtils";

export const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState<SignErrMsg>(null);

  // AuthedPage.tsxから渡ってくる
  const destinationAfterSignIn = useLocation().state as State;

  return (
    <Sign
      title="signIn"
      errMsg={errMsg}
      switchBtnConfig={{ label: "signUp", path: getPathToSignUp() }}
    >
      <SignForm
        btnText={t("signIn")}
        pwAutoComplete={"current-password"}
        formOperation={async (data) => {
          setErrMsg(null);
          try {
            await signInUser(data);
            // ログイン後に元のページにリダイレクト
            navigate(destinationAfterSignIn ?? getPathToAllAnimals());
          } catch (err) {
            setErrMsg(getSignErrMsg(err));
          }
        }}
      />
    </Sign>
  );
};
