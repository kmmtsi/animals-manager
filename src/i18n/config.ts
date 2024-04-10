import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import commonEn from "./locales/en/commonEn.json";
import commonJa from "./locales/ja/commonJa.json";
import lpEn from "./locales/en/lpEn.json";
import lpJa from "./locales/ja/lpJa.json";
import privacyPolicyJa from "./locales/ja/privacyPolicyJa.json";
import privacyPolicyEn from "./locales/en/privacyPolicyEn.json";

i18n
  .use(initReactI18next)
  // ユーザーの言語設定を検知（これによりlngプロパティは不要）
  .use(LanguageDetector)
  .init({
    ns: ["common", "lp", "privacyPolicy"],
    defaultNS: "common",
    resources: {
      ja: {
        common: commonJa,
        lp: lpJa,
        privacyPolicy: privacyPolicyJa,
      },
      en: {
        common: commonEn,
        lp: lpEn,
        privacyPolicy: privacyPolicyEn,
      },
    },
    fallbackLng: "ja", // デフォルトの言語を設定, これがないとキーが表示される
    returnObjects: true,
    // returnEmptyString: false, // 空文字での定義を許可に
    // interpolation: {
    //   // 翻訳された文字列内のHTMLやReactコンポーネントをエスケープすることを無効に
    //   escapeValue: false,
    // },
    // react: {
    //   // 指定したHTMLノードを翻訳時にそのまま保持して表示するための設定
    //   transKeepBasicHtmlNodesFor: ["br", "strong", "i", "span"],
    // },
  });

export default i18n;

// returnObjects: true
