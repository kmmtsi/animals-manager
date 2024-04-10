import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  Animal,
  Breeding,
  maxFolderName,
  maxFolderNote,
} from "../../../utils/common/definitions";
import {
  btn,
  btnBlue,
  btnTextOnly,
  formFieldGapY,
  formGapY,
  hover,
  label,
  textArea,
  textInput,
} from "../../../utils/css";
import { NameAndSex } from "../../animal/formattedValues/NameAndSex";
import { BreedingGrid } from "../../breeding/BreedingGrid";
import { ClickableIcon } from "../../generalUI/ClickableIcon";
import { Form, FormOperation } from "../../generalUI/form/Form";
import { Label } from "../../generalUI/form/Label";

export type FolderFormProps<T extends Animal | Breeding> = {
  type: T extends Animal ? "animalsFolder" : "breedingsFolder";
  defaultName: string;
  defaultNote: string;
  itemIds: string[];
  allItems: T[];
  setItemIds: Dispatch<SetStateAction<string[]>>;
  submitBtnText: string;
  onCancelClick: MouseEventHandler<HTMLButtonElement>;
  formOperation: FormOperation;
};

export const FolderForm = <T extends Animal | Breeding>({
  type,
  defaultName,
  defaultNote,
  itemIds,
  allItems,
  setItemIds,
  submitBtnText,
  onCancelClick,
  formOperation,
}: FolderFormProps<T>) => {
  const { t } = useTranslation();

  const filterItems = () => {
    return allItems.filter((item) => {
      return !itemIds.some((id) => id === item.id);
    });
  };

  return (
    <Form className={formGapY} operation={formOperation}>
      {/* name */}
      <div className={formFieldGapY}>
        <Label htmlFor="name" required={true}>
          {t("folderName")}
        </Label>
        <input
          id="name"
          name="name"
          defaultValue={defaultName}
          maxLength={maxFolderName}
          required={true}
          placeholder={t("phForFolderName", {
            max: maxFolderName,
          })}
          autoFocus={true}
          autoComplete="off"
          className={textInput}
        />
      </div>
      {/* items */}
      <div className={formFieldGapY}>
        <label className={label}>
          {t(type === "animalsFolder" ? "animals" : "breedings")}
        </label>
        {/* 選択済み */}
        <div className="space-y-1">
          <div className="text-xs text-slate-500">{t("selected")}</div>
          {/* ボックス */}
          <div className="border rounded min-h-9 p-1 space-y-1">
            {itemIds.map((id, i) => {
              const originalItem = allItems.find((item) => item.id === id) as T;
              return (
                <div
                  key={i}
                  className={`flex items-center border rounded-full bg-gray-200 p-2`}
                >
                  <div className="w-full">
                    {type === "animalsFolder" ? (
                      <NameAndSex animal={originalItem as Animal} />
                    ) : (
                      <BreedingGrid miniBreeding={originalItem as Breeding} />
                    )}
                  </div>
                  <ClickableIcon
                    icon={faClose}
                    onClick={() => {
                      const newItemIds = itemIds.filter((_, j) => i !== j);
                      setItemIds(newItemIds);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* 選択肢 */}
        <div className="space-y-1">
          <div className="text-xs text-slate-500">{t("candidate")}</div>
          {allItems.length > 0 ? (
            // 候補
            <div
              role="listbox"
              className="border rounded max-h-80 overflow-y-auto space-y-1 p-1"
            >
              {filterItems().map((item, i) => (
                <div
                  key={i}
                  role="option"
                  className={`border rounded p-2 ${hover} cursor-pointer`}
                  onClick={() => {
                    setItemIds([...itemIds, item.id]);
                  }}
                >
                  {type === "animalsFolder" ? (
                    <NameAndSex animal={item as Animal} />
                  ) : (
                    <BreedingGrid miniBreeding={item as Breeding} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // itemsが未作成の場合
            <div className="space-y-1">
              <div>{t("noDataCreated")}</div>
            </div>
          )}
        </div>
      </div>
      {/* メモ */}
      <div className={formFieldGapY}>
        <Label htmlFor="note">{t("note")}</Label>
        <textarea
          id="note"
          name="note"
          placeholder={t("phForFolderNote", {
            max: maxFolderNote,
          })}
          className={textArea}
          maxLength={maxFolderNote}
          defaultValue={defaultNote}
        />
      </div>
      <div className="flex gap-x-2">
        {/* 送信ボタン */}
        <button type="submit" className={`${btn} ${btnBlue}`}>
          {t(submitBtnText)}
        </button>
        {/* キャンセルボタン */}
        <button
          type="button"
          className={`${btn} ${btnTextOnly}`}
          onClick={onCancelClick}
        >
          {t("cancel")}
        </button>
      </div>
    </Form>
  );
};
