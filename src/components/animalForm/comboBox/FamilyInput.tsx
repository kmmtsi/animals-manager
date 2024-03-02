import { useRef, useState, SetStateAction, Dispatch } from "react";
import { SelectedFamily } from "./SelectedFamily";
import { Input } from "../../generalUI/form/Input";
import { getAnimalsToSuggest, isFamilyFull } from "../../../utils/animal/utils";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { btn, btnBlue, focus, hover } from "../../../utils/css";
import { Key } from "../../generalUI/Key";
import {
  MiniAnimal,
  familyMapping,
  maxAnimalName,
  maxChildren,
  maxParents,
} from "../../../utils/animal/definitions";
import { NameAndSex } from "../../animalsList/NameAndSex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { findAnimalByName } from "../../../utils/animal/utils";
import { ValidationErrMsgs } from "../../generalUI/form/ValidationErrMsgs";

export const FamilyInput = ({
  type,
  miniFamily,
  setMiniFamily,
  allMiniAnimals,
  miniAnimalsInUse,
}: {
  type: "parents" | "children";
  miniFamily: MiniAnimal[]; // 現在のファミリー
  setMiniFamily: Dispatch<SetStateAction<MiniAnimal[]>>;
  allMiniAnimals: MiniAnimal[];
  miniAnimalsInUse: MiniAnimal[];
}) => {
  const [inputText, setInputText] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [errOnAddMember, setErrOnAddMember] = useState<string[]>([]);

  // dialogを開く
  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  // dialogを閉じる
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  // familyの選択可能な最大数
  const maxFamily = type === "parents" ? maxParents : maxChildren;

  // 実際はdialogが空いているとき以外は再計算の必要ないので改善の余地あり
  const animalsToSuggest = getAnimalsToSuggest(
    inputText,
    miniAnimalsInUse,
    allMiniAnimals
  );

  // memberを追加する
  const addMemberWhenPossible = (
    request:
      | {
          type: "select";
          member: MiniAnimal;
        }
      | {
          type: "input";
          inputText: string;
        }
  ) => {
    if (request.type === "select") {
      // suggestされてる時点で追加可能な要素なのでそのまま追加する
      setMiniFamily((prevFamily) => [...prevFamily, request.member]);
    } else {
      // 未入力の時何もしない
      if(inputText === "") return;
      
      // inputと完全一致するsuggestがあったのかを探す
      const suggestedMember = findAnimalByName(
        request.inputText,
        animalsToSuggest
      );
      if (suggestedMember) {
        // inputと完全一致するsuggestがあった場合、そのまま追加可能
        setMiniFamily((prevFamily) => [...prevFamily, suggestedMember]);
      } else {
        // inputと完全一致するsuggestが無い場合
        // 基本は受け入れて後の正式なバリデーションで判定すればよいので、現在使用中の名前だけNGにし、あとは許容する
        if (
          miniAnimalsInUse.some((animal) => animal.name === request.inputText)
        ) {
          setErrOnAddMember(["同じ名前の動物が既に使用されています"]);
          return;
        } else {
          setMiniFamily((prevFamily) => [
            ...prevFamily,
            { id: "", name: request.inputText, sex: "" },
          ]);
        }
      }
    }
    // inputを空にする
    setInputText("");

    // maxFamilyに達したらdialogを閉じる
    if (isFamilyFull(miniFamily.length + 1, maxFamily)) {
      closeDialog();
    }
  };

  return (
    <div>
      <div className="flex gap-2 border rounded">
        {miniFamily.length > 0 && (
          // メンバーが1つ以上選択されているときだけ表示
          <SelectedFamily
            miniFamily={miniFamily}
            setMiniFamily={setMiniFamily}
            className="p-2"
          />
        )}
        {/* 初期表示ボタン */}
        {!isFamilyFull(miniFamily.length, maxFamily) && (
          // 追加選択の余地があるときだけボタン表示
          <button
            type="button" // formの送信を防ぐ
            className={`text-sm px-2 py-3 text-slate-500 text-start grow rounded ${focus}`}
            onClick={() => openDialog()}
          >
            リストから選択するか新しく登録します
          </button>
        )}
      </div>
      <dialog
        // heightは各componentで設定
        ref={dialogRef}
        className="px-3 py-4 w-full md:w-1/2 rounded drop-shadow-xl backdrop:backdrop-blur-sm"
        onClick={() => closeDialog()}
      >
        {/* dialog中身 */}
        <div
          className="grid gap-y-4"
          onClick={(e) => {
            // dialog内部クリック時にはdialogを閉じない
            e.stopPropagation();
          }}
        >
          {/* Input関連 */}
          <div className="grid grid-cols-12 gap-x-2 gap-y-1">
            {/* inputが一番上のときdialog open時のautoFocus適用される */}
            <Input
              // requiredはnot focusableというエラーが出るのでつけない
              id={type} // parents or children
              value={inputText}
              maxLength={maxAnimalName} // maxLengthで文字数制限
              autoComplete="off"
              className="col-span-11"
              autoFocus={true}
              placeholder={familyMapping[type]} // 親 or 子ども
              onChange={(e) => {
                setInputText(e.target.value);
                setErrOnAddMember([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // form全体の送信を防ぐ
                  e.preventDefault();
                  // Enterでも新規追加可能
                  addMemberWhenPossible({ type: "input", inputText });
                }
              }}
            />
            {/* 新規作成ボタン */}
            <button
              type="button"
              className={`col-span-1 flex justify-center items-center text-lg rounded ${btnBlue}`}
              // ボタンなのでEnter押下でもonClickが発火
              onClick={() => {
                addMemberWhenPossible({ type: "input", inputText });
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <div className="col-span-12 space-y-1">
              <TextLengthIndicator
                currentLength={inputText.length}
                maxLength={maxAnimalName}
              />
              {/* inputからfamilyを登録する際のエラーメッセージ */}
              <ValidationErrMsgs msgs={errOnAddMember} />
            </div>
          </div>
          {/* サジェスチョン */}
          <div className="h-48 md:h-96 overflow-y-auto">
            <div className="px-2 py-1 text-xs text-slate-500 cursor-default">
              {animalsToSuggest.length > 0 ? (
                <div className="flex gap-x-2">
                  <div>リストから選択するか新しく登録します</div>
                  <div className="hidden lg:block">
                    <Key>Tab</Key> 下に移動 / <Key>Shift</Key>+<Key>Tab</Key>{" "}
                    上に移動
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div role="listbox">
              {animalsToSuggest?.map((animal, i) => (
                // サジェスト
                <div
                  key={i}
                  role="option"
                  tabIndex={0}
                  className={`flex items-start px-2 py-3 cursor-pointer border-b ${hover} ${focus}`}
                  onClick={() =>
                    addMemberWhenPossible({ type: "select", member: animal })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // タブでfocusした時にEnterで選択可
                      addMemberWhenPossible({ type: "select", member: animal });
                    }
                  }}
                >
                  <NameAndSex animal={animal} />
                </div>
              ))}
            </div>
          </div>
          {/* 選択済みアイテム関連 */}
          {miniFamily.length > 0 && (
            // 選択済みが1つ以上あるときだけ表示
            <div className="grid gap-y-1">
              <div className="text-xs text-slate-500 pl-2">選択済み</div>
              {/* 選択済みアイテム */}
              <SelectedFamily
                miniFamily={miniFamily}
                setMiniFamily={setMiniFamily}
                // 高さ指定
                className="max-h-20 md:max-h-40 overflow-y-auto"
              />
            </div>
          )}
          <button
            type="button"
            className={`w-fit ml-auto ${btn} ${btnBlue}`}
            onClick={() => closeDialog()}
          >
            閉じる
          </button>
        </div>
      </dialog>
    </div>
  );
};
