import { MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import {
  Sex,
  maxAnimalName,
  maxAnimalNote,
  sexOptions,
} from "../../utils/common/definitions";
import {
  btn,
  btnBlue,
  btnTextOnly,
  formFieldGapY,
  formGapY,
  select,
  textArea,
  textInput,
} from "../../utils/css";
import { Form, FormOperation } from "../generalUI/form/Form";
import { Label } from "../generalUI/form/Label";

export const AnimalForm = ({
  defaultName,
  defaultSex,
  defaultNote,
  submitBtnText,
  onCancelClick,
  formOperation,
}: {
  defaultName: string;
  defaultSex: Sex;
  defaultNote: string;
  submitBtnText: string;
  onCancelClick: MouseEventHandler<HTMLButtonElement>;
  formOperation: FormOperation;
}) => {
  const { t } = useTranslation();

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
          defaultValue={defaultName}
          className={textInput}
        />
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
              {option.label}
            </option>
          ))}
        </select>
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
      <button
        type="button"
        className={`${btn} ${btnTextOnly}`}
        onClick={onCancelClick}
      >
        {t("cancel")}
      </button>
    </Form>
  );
};
