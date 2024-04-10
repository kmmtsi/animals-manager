import { useTranslation } from "react-i18next";
import {
  getPathToHome,
  getPathToPolicy,
  getPathToSignIn,
  getPathToSignUp,
} from "../../utils/common/pageUtils";
import { lpContainer } from "../../utils/css";
import { Logo } from "../generalUI/logo/Logo";
import { FooterMenuGroup } from "./FooterMenuGroup";

export const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-slate-100 mt-auto">
      <nav className={`${lpContainer} py-6 grid grid-cols-12 gap-4 mx-auto`}>
        {/* リンク */}
        <FooterMenuGroup
          group="App"
          items={[
            { label: t("home"), link: getPathToHome() },
            { label: "signUp", link: getPathToSignUp() },
            { label: "signIn", link: getPathToSignIn() },
          ]}
        />
        <FooterMenuGroup
          group="Links"
          items={[{ label: "X (Twitter)", link: "" }]}
        />
        <FooterMenuGroup
          group="Legal"
          items={[{ label: t("privacyPolicy"), link: getPathToPolicy() }]}
        />
        <FooterMenuGroup
          group="Language"
          items={[
            { label: "english", onClick: () => i18n.changeLanguage("en") },
            { label: "japanese", onClick: () => i18n.changeLanguage("ja") },
          ]}
        />
      </nav>
      {/* ロゴ */}
      <div
        className={`${lpContainer} flex items-start justify-center text-center border-t py-4`}
      >
        <Logo />
      </div>
    </footer>
  );
};
