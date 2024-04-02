import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { suggestBox, suggestItem, textInput } from "../../../utils/css";
import { ClickableIcon } from "../ClickableIcon";

type ItemBase = {
  id: string;
  [key: string]: string;
};

export const SearchInput = <T extends ItemBase>({
  searchKey,
  maxSelect,
  maxInput,
  placeholder,
  currentItems,
  setItems,
  suggestableItems,
  renderItem,
}: {
  searchKey: keyof T;
  maxSelect: number;
  maxInput: number;
  placeholder: string;
  currentItems: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  suggestableItems: T[];
  renderItem: (item: T) => JSX.Element;
}) => {
  const { t } = useTranslation();

  const [inputText, setInputText] = useState<string>("");
  const [isSuggestOpen, setIsSuggestOpen] = useState<boolean>(false);

  const handleInputEnter = () => {
    if (inputText === "") return;
    const item = suggestableItems.find((item) => item[searchKey] === inputText);
    if (item) {
      const newItems = [...currentItems, item];
      setItems(newItems);
      setInputText("");
    }
  };

  const handleSuggestClick = (item: T) => {
    setItems([...currentItems, item]);
    setInputText("");
  };

  const handleXClick = (itemToRemove: T) => () => {
    const newItems = currentItems.filter(
      (currentItem) => currentItem.id !== itemToRemove.id
    );
    setItems(newItems);
    setIsSuggestOpen(false);
  };

  const filteredItems = suggestableItems.filter((item) =>
    item[searchKey].includes(inputText)
  );

  return (
    // 外枠
    <div className="flex flex-wrap gap-2 items-center p-1 border rounded ">
      {/* 選択中アイテム */}
      {currentItems.map((item, i) => (
        <div
          key={i}
          className="flex gap-x-1 items-center w-fit px-3 py-1 rounded-full bg-slate-200"
        >
          {renderItem(item)}
          <ClickableIcon icon={faClose} onClick={handleXClick(item)} />
        </div>
      ))}
      {/* 入力関連 */}
      {currentItems.length < maxSelect && (
        /* input + サジェスト */
        <div className="relative grow min-w-64">
          {/* input */}
          <input
            value={inputText}
            maxLength={maxInput}
            className={`${textInput} border-0`}
            placeholder={placeholder}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInputEnter();
              }
            }}
            onFocus={() => setIsSuggestOpen(true)}
            onBlur={() => setIsSuggestOpen(false)}
          />
          {/* サジェスチョン */}
          {isSuggestOpen && (
            <div role="listbox" className={suggestBox}>
              <div className="text-xs text-slate-500 px-3">
                {filteredItems.length > 0
                  ? t("candidate")
                  : t("candidateNotFound")}
              </div>
              {filteredItems.map((item, i) => (
                <div
                  key={i}
                  role="option"
                  className={suggestItem}
                  onPointerDown={() => handleSuggestClick(item)}
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
