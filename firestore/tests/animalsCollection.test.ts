// @vitest-environment node
import {
  getDoc,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import {
  unauthedContext,
  authedContext,
  cleanupWrapper,
  clearFirestoreWrapper,
  initializeTestEnvironmentWrapper,
  requestAuth,
} from "./utils";
import { Animal } from "../../src/utils/animal/definitions";

beforeAll(initializeTestEnvironmentWrapper);
beforeEach(clearFirestoreWrapper);
afterAll(cleanupWrapper);

const validRequestDataSet: Animal = {
  id: "animalId",
  name: "animalName",
  sex: "male",
  mother: {
    id: "motherID",
    name: "motherName",
  },
  father: {
    id: "fatherID",
    name: "fatherName",
  },
  note: "メモメモメモメモメモメモメモ",
  ownerId: requestAuth.uid,
  visibility: "private",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

// ユーザー認証 + 本人の状態で呼び出されるcollectionRef
const getAuthedValidCollectionRef = () => {
  return collection(
    authedContext(requestAuth.uid).firestore(),
    "users/myUserId/animals"
  );
};

/* ===== テストコード ===== */
describe("get", () => {
  test("ユーザー認証なし -> ✕", async () => {
    const docRef = doc(
      unauthedContext().firestore(),
      "users/myUserId/animals",
      "animalId"
    );
    await assertFails(getDoc(docRef));
  });
  test("ユーザー認証あり + 他人 -> ✕", async () => {
    const docRef = doc(
      authedContext("theirUserID").firestore(),
      "users/myUserId/animals",
      "animalId"
    );
    await assertFails(getDoc(docRef));
  });
  test("ユーザー認証あり + 本人 -> ◎", async () => {
    const docRef = doc(
      authedContext(requestAuth.uid).firestore(),
      "users/myUserId/animals",
      "animalId"
    );
    await assertSucceeds(getDoc(docRef));
  });
});

describe("list", () => {
  test("ユーザー認証なし -> ✕", async () => {
    const collectionRef = collection(
      unauthedContext().firestore(),
      "users/myUserId/animals"
    );
    await assertFails(getDocs(collectionRef));
  });
  test("ユーザー認証あり + 他人 -> ✕", async () => {
    const collectionRef = collection(
      authedContext("theirUserID").firestore(),
      "users/myUserId/animals"
    );
    await assertFails(getDocs(collectionRef));
  });
  test("ユーザー認証あり + 本人 -> ◎", async () => {
    await assertSucceeds(getDocs(getAuthedValidCollectionRef()));
  });
});

describe("create", () => {
  describe("ユーザー認証", () => {
    test("ユーザー認証なし -> ✕", async () => {
      const collectionRef = collection(
        unauthedContext().firestore(),
        "users/myUserId/animals"
      );
      await assertFails(addDoc(collectionRef, validRequestDataSet));
    });
    test("ユーザー認証あり + 他人 -> ✕", async () => {
      const collectionRef = collection(
        authedContext("theirUserID").firestore(),
        "users/myUserId/animals"
      );
      await assertFails(addDoc(collectionRef, validRequestDataSet));
    });
  });

  describe("スキーマ", () => {
    // 代表としてnameとsexが無い場合のみtest
    test("ユーザー認証あり + 本人 + nameなし -> ✕", async () => {
      const { name, ...rest } = validRequestDataSet;
      await assertFails(addDoc(getAuthedValidCollectionRef(), rest));
    });
    test("ユーザー認証あり + 本人 + sexなし -> ✕", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertFails(addDoc(getAuthedValidCollectionRef(), rest));
    });
    test("ユーザー認証あり + 本人 + 未知のフィールド -> ✕", async () => {
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          ...validRequestDataSet,
          unknown: "unknownValue",
        })
      );
    });
  });

  describe("バリデーション", () => {
    // id
    test("ユーザー認証あり + 本人 + idがanimalId以外 -> ✕", async () => {
      const { id, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          id: "anotherAnimalId",
          ...rest,
        })
      );
    });

    // name
    test("ユーザー認証あり + 本人 + nameの型がnumber -> ✕", async () => {
      const { name, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          name: 12345,
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + nameが空文字列 -> ✕", async () => {
      const { name, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          name: "",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + nameが31文字 -> ✕", async () => {
      const { name, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          name: "これは１０文字です。これは１０文字です。これは１０文字です。こ",
          ...rest,
        })
      );
    });

    // sex
    test("ユーザー認証あり + 本人 + sexの値が空文字列 -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値がmale -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "male",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値がfemale -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "female",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値がprobably male -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "probably male",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値がprobably female -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "probably female",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値がneither -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "neither",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値がunclear -> ◎", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "unclear",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + sexの値が「オス」 -> ✕", async () => {
      const { sex, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          sex: "オス",
          ...rest,
        })
      );
    });

    // mother
    test("ユーザー認証あり + 本人 + mother.idが空文字列 -> ◎", async () => {
      const { mother, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          mother: {
            id: "",
            name: validRequestDataSet.mother.name,
          },
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + mother.nameが空文字列 -> ◎", async () => {
      const { mother, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          mother: {
            id: validRequestDataSet.mother.id,
            name: "",
          },
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + mother.nameが31文字 -> ✕", async () => {
      const { mother, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          mother: {
            id: validRequestDataSet.mother.id,
            name: "これは１０文字です。これは１０文字です。これは１０文字です。こ",
          },
          ...rest,
        })
      );
    });

    // father
    test("ユーザー認証あり + 本人 + father.idが空文字列 -> ◎", async () => {
      const { father, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          father: {
            id: "",
            name: validRequestDataSet.father.name,
          },
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + father.nameが空文字列 -> ◎", async () => {
      const { father, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          father: {
            id: validRequestDataSet.father.id,
            name: "",
          },
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + father.nameが31文字 -> ✕", async () => {
      const { father, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          father: {
            id: validRequestDataSet.father.id,
            name: "これは１０文字です。これは１０文字です。これは１０文字です。こ",
          },
          ...rest,
        })
      );
    });

    // note
    test("ユーザー認証あり + 本人 + noteが空文字列 -> ◎", async () => {
      const { note, ...rest } = validRequestDataSet;
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), {
          note: "",
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + noteが501文字 -> ✕", async () => {
      const { note, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          note: "これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。----100---これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。----200---これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。----300---これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。----400---これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。これは１０文字です。----500---1",
          ...rest,
        })
      );
    });

    // ownerId
    test("ユーザー認証あり + 本人 + ownerIDが不明なID -> ✕", async () => {
      const { ownerId, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          ownerId: "theirUserID",
          ...rest,
        })
      );
    });

    // visibility
    test("ユーザー認証あり + 本人 + visibilityがboolean -> ✕", async () => {
      const { visibility, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          visibility: false,
          ...rest,
        })
      );
    });
    test("ユーザー認証あり + 本人 + visibilityが不明な文字列 -> ✕", async () => {
      const { visibility, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          visibility: "hidden",
          ...rest,
        })
      );
    });

    // createdAt
    test("ユーザー認証あり + 本人 + createdAtが文字列 -> ✕", async () => {
      const { createdAt, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          createdAt: "2024年1月22日 15:57:52 UTC+9",
          ...rest,
        })
      );
    });

    // updatedAt
    test("ユーザー認証あり + 本人 + updatedAtが文字列 -> ✕", async () => {
      const { updatedAt, ...rest } = validRequestDataSet;
      await assertFails(
        addDoc(getAuthedValidCollectionRef(), {
          updatedAt: "2024年1月22日 15:57:52 UTC+9",
          ...rest,
        })
      );
    });
  });

  describe("成功", () => {
    test("ユーザー認証あり + 本人 + 全てのフィールドと値が正しい -> ◎", async () => {
      await assertSucceeds(
        addDoc(getAuthedValidCollectionRef(), validRequestDataSet)
      );
    });
  });
});
