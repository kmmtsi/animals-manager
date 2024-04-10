import { useTranslation } from "react-i18next";
import {
  StatusLabel,
  StatusValue,
  statusOptions,
} from "../../../utils/common/definitions";

export const Status = ({
  value,
  enableEmpty,
}: {
  value: StatusValue;
  enableEmpty?: boolean;
}): StatusLabel | "" => {
  const { t } = useTranslation();
  const label = statusOptions.find((option) => option.value === value)
    ?.label as StatusLabel;

  return label === "notSelected" && enableEmpty ? "" : t(label);
};
