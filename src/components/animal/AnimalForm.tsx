import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Animal,
  HealthConditionValue,
  SexValue,
  healthConditionOptions,
  maxAnimalName,
  maxAnimalNote,
  sexOptions,
} from "../../utils/common/definitions";
import {
  btn,
  btnBlue,
  btnTextOnly,
  dateInput,
  formFieldGapY,
  formGapY,
  select,
  textArea,
  textInput,
} from "../../utils/css";
import { Form, FormOperation } from "../generalUI/form/Form";
import { Label } from "../generalUI/form/Label";
import { AnimalChip } from "./AnimalChip";

export type OnCancelClick = MouseEventHandler<HTMLButtonElement> | null;

export const AnimalForm = ({
  prevName,
  name,
  setName,
  defaultSex,
  defaultNote,
  defaultDateOfBirth,
  defaultHealthCondition,
  submitBtnText,
  allAnimals,
  onCancelClick,
  formOperation,
}: {
  name: string;
  prevName?: string;
  setName: Dispatch<SetStateAction<string>>;
  defaultSex: SexValue;
  defaultNote: string;
  defaultDateOfBirth: string;
  defaultHealthCondition: HealthConditionValue;
  submitBtnText: string;
  allAnimals: Animal[];
  onCancelClick: OnCancelClick;
  formOperation: FormOperation;
}) => {
  const { t } = useTranslation();
  const [suggestedAnimal, setSuggestedAnimal] = useState<Animal | null>(null);
  const navigate = useNavigate();

  return (
    <Form className={formGapY} operation={formOperation}>
      {/* name */}
      <div className={formFieldGapY}>
        <Label htmlFor="name" required={true}>
          {t("name")}
        </Label>
        <input
          id="name"
          name="name"
          placeholder={t("phForAnimalName")}
          required={true}
          maxLength={maxAnimalName}
          autoFocus={true}
          autoComplete="off"
          className={textInput}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuggestedAnimal(null);
            if (e.target.value !== prevName) {
              const existingAnimal = allAnimals.find(
                (animal) => animal.name === e.target.value
              );
              existingAnimal && setSuggestedAnimal(existingAnimal);
            }
          }}
        />
        {suggestedAnimal && (
          <div className="text-xs flex items-center gap-x-1">
            <div className="text-slate-500">{t("isntItThisAnimal")}</div>
            <AnimalChip animal={suggestedAnimal} options={{ navigate }} />
          </div>
        )}
      </div>
      {/* sex */}
      <div className={formFieldGapY}>
        <Label htmlFor="sex">{t("sex")}</Label>
        <select
          id="sex"
          name="sex"
          className={select}
          defaultValue={defaultSex}
        >
          {sexOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </select>
      </div>
      {/* healthCondition */}
      <div className={formFieldGapY}>
        <Label htmlFor="healthCondition">{t("healthCondition")}</Label>
        <select
          id="healthCondition"
          name="healthCondition"
          className={select}
          defaultValue={defaultHealthCondition}
        >
          {healthConditionOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </select>
      </div>
      {/* dateOfBirth */}
      <div className={formFieldGapY}>
        <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          className={`${dateInput}`}
          defaultValue={defaultDateOfBirth}
        />
      </div>
      {/* note */}
      <div className={formFieldGapY}>
        <Label htmlFor="note">{t("note")}</Label>
        <textarea
          id="note"
          name="note"
          placeholder={t("phForAnimalNote", {
            maxAnimalNote,
          })}
          maxLength={maxAnimalNote}
          className={textArea}
          defaultValue={defaultNote}
        />
      </div>
      {/* 送信ボタン */}
      <button type="submit" className={`w-fit ${btn} ${btnBlue}`}>
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
    </Form>
  );
};
