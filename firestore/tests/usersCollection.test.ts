// @vitest-environment node
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import {
  unauthedContext,
  authedContext,
  cleanupWrapper,
  clearFirestoreWrapper,
  initializeTestEnvironmentWrapper,
  requestAuth,
} from "./utils";

beforeAll(initializeTestEnvironmentWrapper);
beforeEach(clearFirestoreWrapper);
afterAll(cleanupWrapper);

const validRequestDataSet = {
  email: requestAuth.email,
  createdAt: serverTimestamp(),
};

// ユーザー認証 + 本人の状態で呼び出されるdocRef
const getAuthedValidDocRef = () => {
  return doc(authedContext(requestAuth.uid).firestore(), "users", "myUserId");
};

/* ===== テストコード ===== */
describe("get", () => {
  test("ユーザー認証なし -> ✕", async () => {
    const docRef = doc(unauthedContext().firestore(), "users", "myUserId");
    await assertFails(getDoc(docRef));
  });
  test("ユーザー認証あり + 他人 -> ✕", async () => {
    const docRef = doc(
      authedContext("theirUserId").firestore(),
      "users",
      "myUserId"
    );
    await assertFails(getDoc(docRef));
  });
  test("ユーザー認証あり + 本人 -> ◎", async () => {
    await assertSucceeds(getDoc(getAuthedValidDocRef()));
  });
});

describe("create", () => {
  describe("ユーザー認証", () => {
    // 認証
    test("ユーザー認証なし -> ✕", async () => {
      const docRef = doc(unauthedContext().firestore(), "users", "myUserId");
      await assertFails(setDoc(docRef, validRequestDataSet));
    });
    test("ユーザー認証あり + 他人 -> ✕", async () => {
      const docRef = doc(
        authedContext("theirUserId").firestore(),
        "users",
        "myUserId"
      );
      await assertFails(setDoc(docRef, validRequestDataSet));
    });
  });

  describe("スキーマ", () => {
    test("ユーザー認証あり + 本人 + emailなし -> ✕", async () => {
      const { email, ...rest } = validRequestDataSet;
      await assertFails(setDoc(getAuthedValidDocRef(), rest));
    });
    test("ユーザー認証あり + 本人 + createdAtなし -> ✕", async () => {
      const { createdAt, ...rest } = validRequestDataSet;
      await assertFails(setDoc(getAuthedValidDocRef(), rest));
    });
    test("ユーザー認証あり + 本人 + 未知のフィールド -> ✕", async () => {
      await assertFails(
        setDoc(getAuthedValidDocRef(), {
          ...validRequestDataSet,
          unknownField: "unknow",
        })
      );
    });
  });

  describe("バリデーション", () => {
    test("ユーザー認証あり + 本人 + emailが本人以外のもの -> ✕", async () => {
      const { email, ...rest } = validRequestDataSet;
      await assertFails(
        setDoc(getAuthedValidDocRef(), {
          email: "theirEmail@gmail.com",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + createdAtが文字列 -> ✕", async () => {
      const { createdAt, ...rest } = validRequestDataSet;
      await assertFails(
        setDoc(getAuthedValidDocRef(), {
          createdAt: "2024年1月22日 15:57:52 UTC+9",
          ...rest,
        })
      );
    });
  });

  describe("成功", () => {
    test("ユーザー認証あり + 本人 + 正しいfieldとその値 -> ◎", async () => {
      await assertSucceeds(setDoc(getAuthedValidDocRef(), validRequestDataSet));
    });
  });
});
