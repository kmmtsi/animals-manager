import { Animal, Sex } from "./animal/definitions";

export const devConsole = (content, options?: { method?: "log" | "err" }) => {
  if (import.meta.env.DEV) {
    if (options?.method === "err") {
      console.error("[devOnly]", content);
    } else {
      console.log("[devOnly]", content);
    }
  }
};

// 性別を日本語に変換
export const convertSexToJapanese = (sex: Sex) => {
  switch (sex) {
    case "male":
      return "オス";
    case "female":
      return "メス";
    case "":
      return "未入力";
  }
};
