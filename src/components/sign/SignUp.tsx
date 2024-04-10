import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  getPathToAllAnimals,
  getPathToSignIn,
} from "../../utils/common/pageUtils";
import { Sign, SignErrMsg } from "./Sign";
import { SignForm } from "./SignForm";
import { getSignErrMsg, signUpUser } from "./signUtils";

export const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState<SignErrMsg>(null);

  return (
    <Sign
      title="signUp"
      errMsg={errMsg}
      switchBtnConfig={{ label: "signIn", path: getPathToSignIn() }}
    >
      <SignForm
        btnText={t("signUp")}
        pwAutoComplete={"new-password"}
        formOperation={async (data) => {
          setErrMsg(null);
          try {
            await signUpUser(data);
            navigate(getPathToAllAnimals());
          } catch (err) {
            setErrMsg(getSignErrMsg(err));
          }
        }}
      />
    </Sign>
  );
};
