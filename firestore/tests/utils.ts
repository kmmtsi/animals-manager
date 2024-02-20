import { readFileSync } from "fs";
import { resolve } from "path";
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

let testEnv: RulesTestEnvironment;

export const initializeTestEnvironmentWrapper = async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-animals-manager-9dde4", // 頭にdemo-つけてみた,
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf-8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
};
export const clearFirestoreWrapper = async () => await testEnv.clearFirestore();
export const cleanupWrapper = async () => await testEnv.cleanup();

export const requestAuth = {
  uid: "myUserId",
  email: "myEmail@gmail.com",
};

// ユーザー認証なしを再現
export const unauthedContext = () => {
  return testEnv.unauthenticatedContext();
};

// ユーザー認証ありを再現
export const authedContext = (userId: string) => {
  return testEnv.authenticatedContext(userId, {
    email: "myEmail@gmail.com",
  });
};
