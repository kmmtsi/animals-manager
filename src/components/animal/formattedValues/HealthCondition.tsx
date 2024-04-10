import { useTranslation } from "react-i18next";
import {
  HealthConditionLabel,
  HealthConditionValue,
  healthConditionOptions,
} from "../../../utils/common/definitions";

export const HealthCondition = ({
  value,
  enableEmpty,
}: {
  value: HealthConditionValue;
  enableEmpty?: boolean;
}): HealthConditionLabel | "" => {
  const { t } = useTranslation();
  const label = healthConditionOptions.find((option) => option.value === value)
    ?.label as HealthConditionLabel;

  return label === "notSelected" && enableEmpty ? "" : t(label);
};
