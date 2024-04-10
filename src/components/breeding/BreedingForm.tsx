import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { getSuggestableMiniAnimals } from "../../utils/breeding/breedingUtils";
import {
  Animal,
  MiniAnimal,
  StatusValue,
  maxAnimalName,
  maxBreedingNote,
  maxChildren,
  maxParents,
  statusOptions,
} from "../../utils/common/definitions";
import {
  btn,
  btnBlue,
  btnTextOnly,
  dateInput,
  formFieldGapY,
  formGapY,
  label,
  select,
  textArea,
} from "../../utils/css";
import { NameAndSex } from "../animal/formattedValues/NameAndSex";
import { Form, FormOperation } from "../generalUI/form/Form";
import { Label } from "../generalUI/form/Label";
import { SearchInput } from "../generalUI/form/SearchInput";

export type OnCancelClick = MouseEventHandler<HTMLButtonElement> | undefined;

export const BreedingForm = ({
  parents,
  children,
  defaultStatus,
  defaultNote,
  defaultStartDate,
  defaultEndDate,
  allAnimals,
  setParents,
  setChildren,
  submitBtnText,
  onCancelClick,
  formOperation,
}: {
  parents: MiniAnimal[];
  children: MiniAnimal[];
  defaultStatus: StatusValue;
  defaultNote: string;
  defaultStartDate: string;
  defaultEndDate: string;
  allAnimals: Animal[];
  setParents: Dispatch<SetStateAction<MiniAnimal[]>>;
  setChildren: Dispatch<SetStateAction<MiniAnimal[]>>;
  submitBtnText: string;
  onCancelClick: OnCancelClick;
  formOperation: FormOperation;
}) => {
  const { t } = useTranslation();

  return (
    <Form className={formGapY} operation={formOperation}>
      {/* parents */}
      <div className={formFieldGapY}>
        <label className={label}>{t("parents")}</label>
        <SearchInput
          searchKey="name"
          maxSelect={maxParents}
          maxInput={maxAnimalName}
          placeholder={t("searchAnimals")}
          currentItems={parents}
          setItems={setParents}
          suggestableItems={getSuggestableMiniAnimals(
            "parents",
            parents,
            children,
            allAnimals
          )}
          renderItem={(item) => <NameAndSex animal={item} />}
        />
      </div>
      {/* children */}
      <div className={formFieldGapY}>
        <label className={label}>{t("children")}</label>
        <SearchInput
          searchKey="name"
          maxSelect={maxChildren}
          maxInput={maxAnimalName}
          placeholder={t("searchAnimals")}
          currentItems={children}
          setItems={setChildren}
          suggestableItems={getSuggestableMiniAnimals(
            "children",
            parents,
            children,
            allAnimals
          )}
          renderItem={(item) => <NameAndSex animal={item} />}
        />
      </div>
      {/* status */}
      <div className={formFieldGapY}>
        <Label htmlFor="status">{t("status")}</Label>
        <select
          id="status"
          name="status"
          className={select}
          defaultValue={defaultStatus}
        >
          {statusOptions.map((opt, i) => (
            <option key={i} value={opt.value}>
              {t(opt.label)}
            </option>
          ))}
        </select>
      </div>
      {/* startDate */}
      <div className={formFieldGapY}>
        <Label htmlFor="startDate">{t("startDate")}</Label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          className={`${dateInput}`}
          defaultValue={defaultStartDate}
        />
      </div>
      {/* endDate */}
      <div className={formFieldGapY}>
        <Label htmlFor="endDate">{t("endDate")}</Label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          className={`${dateInput}`}
          defaultValue={defaultEndDate}
        />
      </div>
      {/* note */}
      <div className={formFieldGapY}>
        <Label htmlFor="note">{t("note")}</Label>
        <textarea
          id="note"
          name="note"
          placeholder={t("placeholderForBreedingNote", {
            maxBreedingNote,
          })}
          className={textArea}
          maxLength={maxBreedingNote}
          defaultValue={defaultNote}
        />
      </div>
      {/* ボタン */}
      <div className="flex gap-x-2">
        {/* 更新ボタン */}
        <button type="submit" className={`${btn} ${btnBlue}`}>
          {submitBtnText}
        </button>
        {/* キャンセルボタン */}
        {onCancelClick && (
          <button
            type="button"
            className={`${btn} ${btnTextOnly}`}
            onClick={onCancelClick}
          >
            {t("cancel")}
          </button>
        )}
      </div>
    </Form>
  );
};
