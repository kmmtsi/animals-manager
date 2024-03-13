import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import { handleCreateAnimal } from "../../utils/animal/handleCreateAnimal";
import { handleUpdateAnimal } from "../../utils/animal/handleUpdateAnimal";
import { validateName, validateNote } from "../../utils/animal/validators";
import {
  Animal,
  Pair,
  Sex,
  maxAnimalName,
  maxNote,
  sexOptions,
} from "../../utils/common/definitions";
import {
  WriteResult,
  convertErrToMsgs,
  useFetchDocs,
} from "../../utils/common/utils";
import {
  btn,
  btnBlue,
  fieldErr,
  formField,
  select,
  textArea,
  textInput,
} from "../../utils/css";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import { Msgs } from "../generalUI/Msgs";
import { Form } from "../generalUI/form/Form";
import { Label } from "../generalUI/form/Label";
import { TextLengthIndicator } from "../generalUI/form/TextLengthIndicator";

// TODO: 未送信で画面遷移時にalert表示
// TODO: pair内でサジェストするanimalsを絞り込む＋miniAnimalsを使う

export const AnimalForm = ({
  allPairs,
  prevAnimal,
  pairsMutator,
  setIsEdit,
}: {
  allPairs?: Pair[];
  prevAnimal?: Animal;
  pairsMutator?: KeyedMutator<Pair[]>;
  setIsEdit?: Dispatch<SetStateAction<boolean>>;
}) => {
  const user = useOutletContext<User>();

  const {
    data: allAnimals,
    isLoading: isLoadingAnimals,
    error: animalsErr,
    mutate: animalsMutator,
  } = useFetchDocs<Animal>(user.uid, "animals");

  const [name, setName] = useState<string>(prevAnimal?.name ?? "");
  const [note, setNote] = useState<string>(prevAnimal?.note ?? "");

  // 送信の制御に使用するのでコンポ内ではなくここで定義
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [noteErr, setNoteErr] = useState<string | null>(null);

  // 書き込み結果
  const [writeResult, setWriteResult] = useState<WriteResult | undefined>(
    undefined
  );

  // 動物作成成功後のformのリセット
  const resetForm = (form: HTMLFormElement) => {
    form.reset();
    setName("");
    setNote("");
    setNameErr(null);
    setNoteErr(null);
  };

  return (
    <>
      {allAnimals && (
        <Form
          operation={async (data, form) => {
            // errがないときだけ実行可能
            if (nameErr || noteErr) return;

            const commonProps = {
              name: data.name as string,
              sex: data.sex as Sex,
              note: data.note as string,
              userId: user.uid,
              allAnimals,
              animalsMutator,
            };
            
            try {
              if (allPairs && prevAnimal && pairsMutator && setIsEdit) {
                // update
                await handleUpdateAnimal({
                  ...commonProps,
                  allPairs,
                  pairsMutator,
                  prevAnimal,
                });
                resetForm(form);
                setIsEdit(false);
              } else {
                // create
                await handleCreateAnimal(commonProps);
              }
              // DB書き込み結果をセット
              setWriteResult({
                status: "success",
                msgs: ["書き込みに成功しました"],
              });
            } catch (err) {
              setWriteResult({
                status: "err",
                msgs: convertErrToMsgs(err),
              });
            }
          }}
        >
          {/* DB書き込み結果 */}
          {writeResult && (
            <Msgs role={writeResult.status} msgs={writeResult.msgs} />
          )}
          {/***** 名前 *****/}
          <div className={formField}>
            <Label htmlFor="name" required={true}>
              名前
            </Label>
            <input
              id="name"
              name="name"
              placeholder="（必須）一意の動物のID、名称、ニックネームなど"
              required={true}
              maxLength={maxAnimalName}
              autoFocus={true}
              value={name}
              className={textInput}
              onChange={(e) => {
                setName(e.target.value);
                setNameErr(validateName(e.target.value, allAnimals));
              }}
            />
            {/* エラーメッセージ */}
            {nameErr && <div className={fieldErr}>{nameErr}</div>}
            <TextLengthIndicator
              currentLength={name.length}
              maxLength={maxAnimalName}
            />
          </div>
          {/***** 性別 *****/}
          <div className={formField}>
            <Label htmlFor="sex">性別</Label>
            <select
              id="sex"
              name="sex"
              className={select}
              defaultValue={prevAnimal ? prevAnimal.sex : ""}
            >
              {sexOptions.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/***** メモ *****/}
          <div className={formField}>
            <Label htmlFor="note">メモ</Label>
            <textarea
              id="note"
              name="note"
              placeholder="この動物についてメモしておきたいことを自由に記入しましょう"
              rows={8}
              maxLength={maxNote}
              value={note}
              className={textArea}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteErr(validateNote(e.target.value));
              }}
            />
            {/* エラーメッセージ */}
            {noteErr && <div className={fieldErr}>{noteErr}</div>}
            <TextLengthIndicator
              currentLength={note.length}
              maxLength={maxNote}
            />
          </div>
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
          </div>
        </Form>
      )}
      {isLoadingAnimals && <LoadingIndicator />}
      {animalsErr && <Msgs role="err" msgs={animalsErr.message} />}
    </>
  );
};
