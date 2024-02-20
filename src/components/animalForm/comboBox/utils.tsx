import { Dispatch, SetStateAction, RefObject, ForwardedRef } from "react";
import { BaseAnimal } from "../../../utils/animal/definitions";

const isItemNew = (item: BaseAnimal, selectedItems: BaseAnimal[]) =>
  // itemが既にselectedItemsに含まれていないかどうか
  !selectedItems.some((selectedItem) => selectedItem.name === item.name);

const isItemAllowed = (item: BaseAnimal, ngItems: BaseAnimal[]) =>
  // itemがngItemsに含まれていないかどうか
  !ngItems.some((ngItem) => ngItem.name === item.name);

const getSpaceLeft = (selectedItems: BaseAnimal[], maxSelect: number) =>
  // selectedItemsに残り何個のアイテムが入るか
  maxSelect - selectedItems.length;

export const isSpaceLeft = (selectedItems: BaseAnimal[], maxSelect: number) =>
  // selectedItemsにまだアイテムを追加できるかどうか
  getSpaceLeft(selectedItems, maxSelect) > 0;

const isItemAcceptable = (
  item: BaseAnimal,
  selectedItems: BaseAnimal[],
  ngItems: BaseAnimal[],
  maxSelect: number
) =>
  // itemをselectedItemsに追加してよいかどうか
  // selectedItems視点
  isItemNew(item, selectedItems) &&
  isItemAllowed(item, ngItems) &&
  isSpaceLeft(selectedItems, maxSelect);

const isInputUnique = (inputValue: string, suggestItems: BaseAnimal[]) =>
  // inputに入力された値がsuggestionsに既に含まれていないかどうか
  !suggestItems.some((item) => item.name === inputValue);

export const isItemAddableFromInput = (
  inputValue: string,
  selectedItems: BaseAnimal[],
  ngItems: BaseAnimal[],
  maxSelect: number
) =>
  // 新しいアイテムを追加できるかどうか
  // input視点
  // inputに値が入っているか
  inputValue.length > 0 &&
  // inputに入力された値がsuggestionsに既に含まれていないか
  isInputUnique(inputValue, selectedItems) &&
  // itemをselectedItemsに追加してよいか
  isItemAcceptable(
    { id: "", name: inputValue, sex: "" },
    selectedItems,
    ngItems,
    maxSelect
  );

export const setSuggestItemsWrapper = (
  regex: RegExp,
  selectedItems: BaseAnimal[],
  originalItems: BaseAnimal[],
  ngItems: BaseAnimal[],
  maxSelect: number,
  setSuggestItems: Dispatch<SetStateAction<BaseAnimal[]>>
) => {
  // 呼ばれるタイミング
  // Dialogが開かれた時（ngItemsはコンポーネント外で独立して決定されるため）
  // inputに入力があった時
  // selectedItemsにアイテムが追加された時
  // selectedItemsからアイテムが削除された時
  if (!isSpaceLeft(selectedItems, maxSelect)) {
    // もう選択する余地がない（たぶんこのパターンはないが念のため）
    setSuggestItems([]);
  } else {
    // 常に与えられた完全なリストからフィルタリングする
    const newSuggestItems = originalItems.filter((originalItem) => {
      // 【個別】のアイテムをサジェストに含めて良いか
      const isMatch = originalItem.name.match(regex); // 正規表現にマッチ
      return (
        isItemNew(originalItem, selectedItems) &&
        isItemAllowed(originalItem, ngItems) &&
        isMatch
      );
    });
    setSuggestItems(newSuggestItems);
  }
};

export const handleSelect = (
  // suggestItemの選択または新規アイテムの追加が要請されたときに実行されるバリデーションを含む関数
  selectedItem: BaseAnimal,
  selectedItems: BaseAnimal[],
  setSelectedItems: Dispatch<SetStateAction<BaseAnimal[]>>,
  setInputValue: Dispatch<SetStateAction<string>>,
  setRegex: Dispatch<SetStateAction<RegExp>>,
  originalItems: BaseAnimal[],
  setSuggestItems: Dispatch<SetStateAction<BaseAnimal[]>>,
  dialogRef: ForwardedRef<HTMLDialogElement>,
  maxSelect: number,
  ngItems: BaseAnimal[]
) => {
  if (isItemAcceptable(selectedItem, selectedItems, ngItems, maxSelect)) {
    // アイテムが追加可能
    // 新しいselectedItemsを作成する
    const newSelectedItems = [...selectedItems, selectedItem];
    setSelectedItems(newSelectedItems);
    // 次回分のスペースない場合はモーダルを閉じる
    getSpaceLeft(newSelectedItems, maxSelect) < 1 &&
      closeDialog(dialogRef as RefObject<HTMLDialogElement>);
    // inputをクリア
    setInputValue("");
    const newRegex = new RegExp("", "i");
    setRegex(newRegex);
    setSuggestItemsWrapper(
      newRegex,
      newSelectedItems,
      originalItems,
      ngItems,
      maxSelect,
      setSuggestItems
    );
  }
};

export const openDialog = (
  ref: RefObject<HTMLDialogElement>,
  regex: RegExp,
  selectedItems: BaseAnimal[],
  originalItems: BaseAnimal[],
  ngItems: BaseAnimal[],
  maxSelect: number,
  setSuggestItems: Dispatch<SetStateAction<BaseAnimal[]>>
) => {
  // ダイアログを開くときにサジェストを更新
  // 外部から与えられるngItemsを元に再計算する必要がある為
  setSuggestItemsWrapper(
    regex,
    selectedItems,
    originalItems,
    ngItems,
    maxSelect,
    setSuggestItems
  );
  ref.current?.showModal();
};

export const closeDialog = (ref: RefObject<HTMLDialogElement>) => {
  ref.current?.close();
};
