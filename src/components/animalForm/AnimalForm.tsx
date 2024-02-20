import { useState } from "react";
import { User } from "firebase/auth";
import { Form } from "../generalUI/form/Form";
import { NameFormField } from "./formFields/NameFormField";
import { SexFormField } from "./formFields/SexFormField";
import { ParentsFormField } from "./formFields/ParentsFormField";
import { ChildrenFormField } from "./formFields/ChildrenFormField";
import { NoteFormField } from "./formFields/NoteFormField";
import { useOutletContext } from "react-router-dom";
import { Alert } from "../generalUI/Alert";
import { Btn } from "../generalUI/btn/Btn";
import { useSWRAnimals } from "../../utils/animal/fetch";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import {
  Animal,
  Sex,
  Parent,
  Child,
  BaseAnimal,
} from "../../utils/animal/definitions";
import { getBaseAnimals, getChangedFamily } from "../../utils/animal/utils";
import { getChangedFields } from "../../utils/animal/utils";
import {
  validateAnimal,
  ValidationResult,
} from "../../utils/animal/validate/validateAnimal";
import {
  writeAnimals,
  WriteResult,
} from "../../utils/animal/write/writeAnimals";

// TODO: 未送信で画面遷移時にalert表示

export const AnimalForm = ({
  // 新規作成時は疑似的にprevAnimalを与える
  // update完了時はprevAnimalが更新されて渡されてくる
  prevAnimal = {
    id: "",
    name: "",
    sex: "",
    parents: [],
    children: [],
    note: "",
    ownerId: "",
    visibility: "private",
    createdAt: "",
    updatedAt: "",
  },
}: {
  prevAnimal?: Animal;
}) => {
  // userを取得
  const user = useOutletContext<User>();

  // animalsを取得
  const {
    data,
    isLoading,
    error: errOnReadAnimals,
    mutate,
  } = useSWRAnimals(user.uid);

  // createかupdateかを判定
  const isCreate = prevAnimal.id === "";

  // animalsを配列の形式にする
  const animals: Animal[] = data || [];

  // baseAnimalsを作成
  const baseAnimals = getBaseAnimals(animals);

  // 各stateを準備
  const [name, setName] = useState<string>(prevAnimal.name);
  const [sex, setSex] = useState<Sex>(prevAnimal.sex);
  const [parents, setParents] = useState<Parent[]>(prevAnimal.parents);
  const [children, setChildren] = useState<Child[]>(prevAnimal.children);
  const [note, setNote] = useState<string>(prevAnimal.note);

  // バリデーション結果
  const [validationResult, setValidationResult] =
    useState<ValidationResult>(null);

  // 書き込み結果
  const [writeResult, setWriteResult] = useState<undefined | WriteResult>(
    undefined
  );

  // name, parents, childrenに使用されているnameはcomboBoxで使用不可
  const ngItems: BaseAnimal[] = [
    { id: "", name: name, sex: "" },
    ...parents,
    ...children,
  ];

  // 以下レンダリングごとに実行されるの改善の余地あり
  // 変更されたparentsの内容を取得
  const changedParents = getChangedFamily(
    parents,
    prevAnimal.parents,
    baseAnimals
  );

  // 変更されたchildrenの内容を取得
  const changedChildren = getChangedFamily(
    children,
    prevAnimal.children,
    baseAnimals
  );

  // 変更されたフィールドを取得
  const changedFields = getChangedFields(
    name,
    sex,
    changedParents,
    changedChildren,
    note,
    prevAnimal
  );

  // console.log("prevParents", prevAnimal.parents);
  // console.log("prevChildren", prevAnimal.children);
  // console.log("parents", parents);
  // console.log("chldren", children);
  // console.log("changedParents", changedParents);
  // console.log("chagedChildren", changedChildren);

  return (
    <>
      {data && (
        <Form
          operation={async (data, form) => {
            // バリデーション
            const res = validateAnimal(
              name,
              parents,
              children,
              baseAnimals,
              changedFields
            );

            if (res) {
              // バリデーションエラーあり
              setValidationResult(res);
            } else {
              // バリデーションエラーなし -> 書き込み処理
              const result = await writeAnimals(
                {
                  name: data.name as string,
                  sex: data.sex as Sex,
                  parents: {
                    currentParents: parents,
                    changedParents,
                  },
                  children: {
                    currentChildren: children,
                    changedChildren,
                  },
                  note: data.note as string,
                },
                user,
                animals,
                mutate,
                prevAnimal,
                isCreate
              );
              // DB書き込み結果をセットする
              setWriteResult(result);

              if (result.status === "success") {
                // 書き込み成功
                if (isCreate) {
                  // createのときのみリセット
                  form.reset(); // Uncontrolled comp向け
                  setName("");
                  setSex("");
                  setParents([]);
                  setChildren([]);
                  setNote("");
                }
              }
            }
          }}
        >
          {/* DB書き込み結果 */}
          {writeResult && (
            <Alert role={writeResult.status}>
              {writeResult.msgs.map((msg, i) => (
                <div key={i} className="py-px">
                  {msg}
                </div>
              ))}
            </Alert>
          )}
          {/***** 名前 *****/}
          <NameFormField
            value={name}
            setValue={setName}
            validationErrMsgs={validationResult ? validationResult.name : []}
            // createのときautoFocusあり
            autoFocus={isCreate}
          />
          {/***** 性別 *****/}
          <SexFormField value={sex} setValue={setSex} />
          {/***** 親 *****/}
          <ParentsFormField
            selectedItems={parents}
            setSelectedItems={setParents}
            originalItems={baseAnimals}
            ngItems={ngItems}
            validationErrMsgs={validationResult ? validationResult.parents : []}
          />
          {/***** 子供 *****/}
          <ChildrenFormField
            selectedItems={children}
            setSelectedItems={setChildren}
            originalItems={baseAnimals}
            ngItems={ngItems}
            validationErrMsgs={
              validationResult ? validationResult.children : []
            }
          />
          {/***** メモ *****/}
          <NoteFormField value={note} setValue={setNote} />
          {/***** 送信ボタン *****/}
          <Btn
            type="submit"
            className="w-fit"
            onClick={() => {
              // 前回のDB書き込み結果をリセット
              setWriteResult(undefined);
              // 前回のバリデーション結果をリセット
              setValidationResult(null);
            }}
            disabled={
              // 1つ以上のフィールドが変更済
              changedFields.length === 0 ? true : false
            }
          >
            {isCreate ? "新規追加" : "更新"}
          </Btn>
        </Form>
      )}
      {isLoading && <LoadingIndicator />}
      {/* DB読み込みがエラーの場合form自体を表示しない */}
      {errOnReadAnimals && <Alert role="err">{errOnReadAnimals.message}</Alert>}
    </>
  );
};
