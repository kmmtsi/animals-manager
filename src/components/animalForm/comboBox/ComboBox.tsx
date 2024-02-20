import { useRef, useState, SetStateAction, Dispatch } from "react";
import { SelectedItems } from "./SelectedItems";
import { Input } from "../../generalUI/form/Input";
import {
  handleSelect,
  closeDialog,
  setSuggestItemsWrapper,
  isItemAddableFromInput,
  openDialog,
  isSpaceLeft,
} from "./utils";
import { Btn } from "../../generalUI/btn/Btn";
import { TextLengthIndicator } from "../../generalUI/form/TextLengthIndicator";
import { btnDisabled, focus, hover } from "../../../utils/css";
import { Key } from "../../generalUI/Key";
import { BaseAnimal } from "../../../utils/animal/definitions";
import { collection, doc } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { NameAndSex } from "../../animalsList/NameAndSex";

export const ComboBox = ({
  id,
  placeholder,
  btnText,
  maxLength,
  originalItems,
  selectedItems,
  setSelectedItems,
  maxSelect,
  disabled, // 初期表示ボタン用
  ngItems,
}: {
  id: string;
  placeholder?: string;
  btnText: string;
  maxLength: number;
  originalItems: BaseAnimal[];
  selectedItems: BaseAnimal[]; // 選択済みアイテム
  setSelectedItems: Dispatch<SetStateAction<BaseAnimal[]>>;
  maxSelect: number;
  disabled?: boolean;
  ngItems: BaseAnimal[];
}) => {
  const user = useOutletContext<User>();
  
  const [suggestItems, setSuggestItems] = useState<BaseAnimal[]>(originalItems);
  const [inputValue, setInputValue] = useState<string>("");
  const [regex, setRegex] = useState<RegExp>(new RegExp("", "i"));
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSelectWrapper = (selectedItem: BaseAnimal) =>
    handleSelect(
      selectedItem,
      selectedItems,
      setSelectedItems,
      setInputValue,
      setRegex,
      originalItems,
      setSuggestItems,
      dialogRef,
      maxSelect,
      ngItems
    );

  return (
    <div>
      <div className="flex gap-2 border rounded">
        {/* 選択済みアイテム */}
        {selectedItems.length > 0 && (
          // 選択済みが1つ以上あるときだけ表示
          <SelectedItems
            regex={regex}
            originalItems={originalItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            setSuggestItems={setSuggestItems}
            className="p-2"
            ngItems={ngItems}
            maxSelect={maxSelect}
          />
        )}
        {/* 初期表示ボタン */}
        {isSpaceLeft(selectedItems, maxSelect) && (
          // 追加選択の余地があるときだけボタン表示
          <>
            <button
              type="button" // formの送信を防ぐ
              className={`text-sm px-2 py-3 text-slate-500 text-start grow rounded ${btnDisabled} ${focus}`}
              onClick={() =>
                openDialog(
                  dialogRef,
                  regex,
                  selectedItems,
                  originalItems,
                  ngItems,
                  maxSelect,
                  setSuggestItems
                )
              }
              disabled={disabled}
            >
              {btnText}
            </button>
          </>
        )}
      </div>
      <dialog
        // heightは各componentで設定
        ref={dialogRef}
        className="px-3 py-4 w-full md:w-1/2 rounded drop-shadow-xl backdrop:backdrop-blur-sm"
        onClick={() => closeDialog(dialogRef)}
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
              id={id}
              value={inputValue}
              maxLength={maxLength}
              autoComplete="off"
              className="col-span-10"
              autoFocus={true}
              placeholder={placeholder}
              onChange={(e) => {
                setInputValue(e.target.value);
                const newRegex = new RegExp(e.target.value, "i");
                setRegex(newRegex);
                setSuggestItemsWrapper(
                  newRegex,
                  selectedItems,
                  originalItems,
                  ngItems,
                  maxSelect,
                  setSuggestItems
                );
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // （重要）所属しているformの送信を防ぐ（詳細下記）
                  e.preventDefault();
                  // Enterでも新規追加可能
                  // inputからの入力が可能かを判定
                  isItemAddableFromInput(
                    inputValue,
                    selectedItems,
                    ngItems,
                    maxSelect
                  ) &&
                    handleSelectWrapper({
                      id: doc(collection(db, "users", user.uid, "animals")).id,
                      name: inputValue,
                      sex: "",
                    });
                }
              }}
            />
            {/* 新規作成ボタン */}
            <Btn
              className="col-span-2 px-0"
              disabled={
                // 新規追加不可のときdisabled
                !isItemAddableFromInput(
                  inputValue,
                  selectedItems,
                  ngItems,
                  maxSelect
                )
              }
              // ボタンなのでEnter押下でもonClickが発火
              onClick={() => {
                // 入力不可の時disabledなのでここでの入力可否判定は不要
                handleSelectWrapper({
                  id: doc(collection(db, "users", user.uid, "animals")).id,
                  name: inputValue,
                  sex: "",
                });
              }}
            >
              作成
            </Btn>
            <TextLengthIndicator
              currentLength={inputValue.length}
              maxLength={maxLength}
              className="col-span-12"
            />
          </div>
          {/* サジェスチョン */}
          <div className="h-48 md:h-96 overflow-y-auto">
            <div className="px-2 py-1 text-xs text-slate-500 cursor-default">
              {suggestItems.length > 0 ? (
                <div className="flex gap-x-2">
                  <div>リストから選択</div>
                  <div className="hidden lg:block">
                    <Key>Tab</Key> 下に移動 / <Key>Shift</Key>+<Key>Tab</Key>{" "}
                    上に移動
                  </div>
                </div>
              ) : (
                <div>候補がありません</div>
              )}
            </div>
            <div role="listbox">
              {suggestItems?.map((suggestItem, i) => (
                /* サジェストアイテム */
                <div
                  key={i}
                  role="option"
                  tabIndex={0}
                  className={`flex items-start px-2 py-3 cursor-pointer border-b ${hover} ${focus}`}
                  onClick={() => handleSelectWrapper(suggestItem)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // タブでfocusした時にEnterで選択可
                      handleSelectWrapper(suggestItem);
                    }
                  }}
                >
                  <NameAndSex name={suggestItem.name} sex={suggestItem.sex} />
                </div>
              ))}
            </div>
          </div>
          {/* 選択済みアイテム関連 */}
          {selectedItems.length > 0 && (
            // 選択済みが1つ以上あるときだけ表示
            <div className="grid gap-y-1">
              <div className="text-xs text-slate-500 pl-2">選択済み</div>
              {/* 選択済みアイテム */}
              <SelectedItems
                regex={regex}
                originalItems={originalItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                setSuggestItems={setSuggestItems}
                ngItems={ngItems}
                maxSelect={maxSelect}
                // 高さ指定
                className="max-h-20 md:max-h-40 overflow-y-auto"
              />
            </div>
          )}
          <Btn className="w-fit ml-auto" onClick={() => closeDialog(dialogRef)}>
            閉じる
          </Btn>
        </div>
      </dialog>
    </div>
  );
};
