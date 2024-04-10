import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { fieldGapY, infoBox } from "../../../../utils/css";

export const ItemInfoField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <div className={fieldGapY}>
      <div>{t(label)}</div>
      <div className={infoBox}>{children}</div>
    </div>
  );
};
