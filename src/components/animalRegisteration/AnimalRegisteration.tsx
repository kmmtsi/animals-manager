import { db } from "../../utils/firebase";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { PageTitle } from "../generalUI/PageTitle";
import { Btn } from "../elements/Btn";
import { User } from "firebase/auth";
import { useState } from "react";
import { Alert } from "../generalUI/Alert";
import { SexInput } from "./inputs/SexInput";
import { MotherInput } from "./inputs/MotherInput";
import { NotMyMotherInput } from "./inputs/NotMyMotherInput";
import { FatherInput } from "./inputs/FatherInput";
import { NotMyFatherInput } from "./inputs/NotMyFatherInput";
import { NoteInput } from "./inputs/NoteInput";
import { Form } from "../elements/Form";
import { NameInput } from "./inputs/NameInput";

export const AnimalRegisteration = ({ user }: { user: User }) => {
  // submit時のメッセージ
  const [isWriteSuccess, setIsWriteSuccess] = useState<boolean | undefined>(
    undefined
  );

  /* 動物をFirestoreに登録 */
  const addDataToDB = async (data: { [k: string]: FormDataEntryValue }) => {
    try {
      // animalsサブコレクションに追加
      const docRef = await addDoc(
        collection(db, "users", user.uid, "animals"),
        {
          name: data.name,
          sex: data.sex,
          mother: data.mother,
          father: data.father,
          note: data.note,
          created_at: serverTimestamp(), // フォーム入力なし
          updated_at: serverTimestamp(), // フォーム入力なし
          ownerId: user.uid, // フォーム入力なし
        }
      );
      // 追加成功
      setIsWriteSuccess(true);
    } catch (err) {
      // 追加失敗
      setIsWriteSuccess(false);
    }
  };

  return (
    <div className="grid gap-y-2">
      {/* submit時のメッセージ */}
      {isWriteSuccess === true && (
        <Alert role="success">新しい動物を追加しました</Alert>
      )}
      {isWriteSuccess === false && (
        <Alert role="error">新しい動物の追加に失敗しました</Alert>
      )}
      <PageTitle tag="h1">新規追加</PageTitle>
      <Form operation={addDataToDB}>
        <div className="flex flex-col gap-y-4">
          <NameInput />
          <SexInput />
          <div className="grid gap-y-2">
            <MotherInput />
            <NotMyMotherInput />
          </div>
          <div className="grid gap-y-2">
            <FatherInput />
            <NotMyFatherInput />
          </div>
          <NoteInput />
        </div>
        <Btn type="submit" className="w-fit">
          新規追加
        </Btn>
      </Form>
    </div>
  );
};
