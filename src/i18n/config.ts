import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translation_ja from "./locales/ja.json";
// import translation_en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // ユーザーの言語設定を検知するために必要
  .init({
    resources: {
      ja: {
        translation: translation_ja,
      },
    //   en: {
    //     translation: translation_en,
    //   },
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
