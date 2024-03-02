import { User } from "firebase/auth";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Animal, MiniAnimal, Sex } from "../../utils/animal/definitions";
import { useFetchAnimals } from "../../utils/animal/fetch";
import {
  WriteResult,
  convertAnimalsToMinis,
  getAnimalById,
  getChangedFields,
  getWriteErrMsgs,
} from "../../utils/animal/utils";
import { deleteAnimals } from "../../utils/animal/deleteAnimals";
import { upsertAnimals } from "../../utils/animal/upsertAnimals";
import { btn, btnBlue, btnOutlineRed } from "../../utils/css";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import { Msg } from "../generalUI/Msg";
import { Form } from "../generalUI/form/Form";
import { FamilyFormField } from "./formFields/FamilyFormField";
import { NameFormField } from "./formFields/NameFormField";
import { NoteFormField } from "./formFields/NoteFormField";
import { SexFormField } from "./formFields/SexFormField";

// TODO: 未送信で画面遷移時にalert表示

export const AnimalForm = ({
  // update完了時はprevAnimalが更新されて渡されてくる
  // prevAnimalが与えられるとき：update
  // prevAnimalが与えられないとき：create
  prevAnimal,
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
  } = useFetchAnimals(user.uid);

  // animalsを配列の形式にする
  const allAnimals: Animal[] = data || [];

  // allMiniAnimalsを作成
  const allMiniAnimals = convertAnimalsToMinis(allAnimals);

  // 各stateを準備
  const [name, setName] = useState<string>(prevAnimal?.name || "");
  const [sex, setSex] = useState<Sex>(prevAnimal?.sex || "");
  const [miniParentAnimals, setMiniParentAnimals] = useState<MiniAnimal[]>(
    prevAnimal
      ? prevAnimal.parents.map((parent) =>
          getAnimalById(parent, allMiniAnimals)
        )
      : []
  );
  const [miniChildAnimals, setMiniChildAnimals] = useState<MiniAnimal[]>(
    prevAnimal
      ? prevAnimal.children.map((child) => getAnimalById(child, allMiniAnimals))
      : []
  );
  const [note, setNote] = useState<string>(prevAnimal?.note || "");

  // 書き込み結果
  const [writeResult, setWriteResult] = useState<WriteResult | undefined>(
    undefined
  );

  // 現在使用されている動物
  const miniAnimalsInUse: MiniAnimal[] = [
    {
      id: prevAnimal?.id || "",
      name,
      sex,
    },
    ...miniParentAnimals,
    ...miniChildAnimals,
  ];

  // 削除後のnavigation用
  const navigate = useNavigate();

  // 動物作成成功後のformのリセット
  const resetFormAfterCreate = (form: HTMLFormElement) => {
    if (!prevAnimal) {
      // create時のみ
      form.reset(); // Uncontrolled comp向け
      setName("");
      setSex("");
      setMiniParentAnimals([]);
      setMiniChildAnimals([]);
      setNote("");
    }
  };

  return (
    <>
      {data && (
        <Form
          operation={async (data, form) => {
            if (prevAnimal) {
              // 更新時は変更があるかを確認する
              const changedFields = getChangedFields(
                name,
                sex,
                miniParentAnimals.map((parent) => parent.id),
                miniChildAnimals.map((child) => child.id),
                note,
                prevAnimal
              );
              if (changedFields.length === 0) {
                setWriteResult({
                  status: "err",
                  msgs: ["変更がありません"],
                });
                return;
              }
            }
            try {
              const result = await upsertAnimals(
                {
                  name: data.name as string,
                  sex: data.sex as Sex,
                  miniParentAnimals,
                  miniChildAnimals,
                  note: data.note as string,
                },
                user.uid,
                allAnimals,
                mutate,
                prevAnimal
              );
              // DB書き込み結果をセットする
              setWriteResult(result);
              // フォームをリセット
              resetFormAfterCreate(form);
            } catch (err) {
              setWriteResult({
                status: "err",
                msgs: getWriteErrMsgs(err),
              });
            }
          }}
        >
          {/* DB書き込み結果 */}
          {writeResult && (
            <Msg role={writeResult.status}>
              {writeResult.msgs.map((msg, i) => (
                <div key={i} className="py-px">
                  {msg}
                </div>
              ))}
            </Msg>
          )}
          {/***** 名前 *****/}
          <NameFormField
            value={name}
            setValue={setName}
            // createのときautoFocusあり
            autoFocus={!prevAnimal}
          />
          {/***** 性別 *****/}
          <SexFormField value={sex} setValue={setSex} />
          {/***** 親 *****/}
          <FamilyFormField
            type="parents"
            miniFamily={miniParentAnimals}
            setMiniFamily={setMiniParentAnimals}
            allMiniAnimals={allMiniAnimals}
            miniAnimalsInUse={miniAnimalsInUse}
          />
          {/***** 子供 *****/}
          <FamilyFormField
            type="children"
            miniFamily={miniChildAnimals}
            setMiniFamily={setMiniChildAnimals}
            allMiniAnimals={allMiniAnimals}
            miniAnimalsInUse={miniAnimalsInUse}
          />
          {/***** メモ *****/}
          <NoteFormField value={note} setValue={setNote} />
          {/***** 送信ボタン *****/}
          <div className="flex gap-x-3">
            <button
              type="submit"
              className={`w-fit ${btn} ${btnBlue}`}
              onClick={() => {
                // 前回のDB書き込み結果をリセット
                setWriteResult(undefined);
              }}
            >
              {prevAnimal ? "更新" : "新規追加"}
            </button>
            {/* 削除ボタン */}
            {prevAnimal && (
              <button
                type="button"
                className={`${btn} ${btnOutlineRed}`}
                onClick={async () => {
                  try {
                    // 削除処理
                    const result = await deleteAnimals(
                      [prevAnimal],
                      user.uid,
                      allAnimals,
                      mutate
                    );
                    // writeResultの情報を持って動物一覧ページへと遷移
                    navigate("/", { state: result });
                  } catch (err) {
                    setWriteResult({
                      status: "err",
                      msgs: getWriteErrMsgs(err),
                    });
                  }
                }}
              >
                削除
              </button>
            )}
          </div>
        </Form>
      )}
      {isLoading && <LoadingIndicator />}
      {/* DB読み込みがエラーの場合form自体を表示しない */}
      {errOnReadAnimals && <Msg role="err">{errOnReadAnimals.message}</Msg>}
    </>
  );
};
