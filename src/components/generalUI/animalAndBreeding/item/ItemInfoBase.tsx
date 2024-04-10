import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  convertErrToMsg,
  convertTsToLocalDateString,
} from "../../../../utils/common/commonUtils";
import {
  btn,
  btnBlue,
  btnOutlineRed,
  btnTextOnly,
  fieldGapY,
  formGapY,
  infoBox,
} from "../../../../utils/css";
import { useToast } from "../../toast/useToast";

export type DeleteItemBtnConfig =
  | {
      label: string;
      handleDeleteItem: () => Promise<void>;
      toastMsg: string;
      navigateTo: string;
    }
  | undefined;

export const ItemInfoBase = ({
  note,
  createdAt,
  updatedAt,
  children,
  setIsUpdateToTrue,
  deleteItemBtnConfig,
  disableBackBtn,
}: {
  note: string;
  createdAt: string;
  updatedAt: string;
  children: ReactNode;
  setIsUpdateToTrue: () => void;
  deleteItemBtnConfig: DeleteItemBtnConfig;
  disableBackBtn: boolean;
}) => {
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className={formGapY}>
        {/***** children *****/}
        {children}
        {/* メモ */}
        <div className={fieldGapY}>
          <div>{t("note")}</div>
          <div className={infoBox}>{note}</div>
        </div>
        {/* 作成日 */}
        <div className={fieldGapY}>
          <div>{t("createdAt")}</div>
          <div>{convertTsToLocalDateString(createdAt)}</div>
        </div>
        {/* 更新日 */}
        <div className={fieldGapY}>
          <div>{t("updatedAt")}</div>
          <div>{convertTsToLocalDateString(updatedAt)}</div>
        </div>
      </div>
      {/* ボタン群 */}
      <div className="flex gap-x-4">
        {/* 更新ボタン */}
        <button
          type="button"
          className={`${btn} ${btnBlue}`}
          onClick={() => setIsUpdateToTrue()}
        >
          {t("update")}
        </button>
        {/* 削除ボタン */}
        {deleteItemBtnConfig && (
          <button
            type="button"
            className={`${btn} ${btnOutlineRed}`}
            onClick={async () => {
              try {
                // 削除処理
                await deleteItemBtnConfig.handleDeleteItem();
                showToast(t(deleteItemBtnConfig.toastMsg));
                navigate(deleteItemBtnConfig.navigateTo);
              } catch (err) {
                showToast(convertErrToMsg(err));
              }
            }}
          >
            {t(deleteItemBtnConfig.label)}
          </button>
        )}
        {/* 戻るボタン */}
        {!disableBackBtn && (
          <button
            type="button"
            className={`${btn} ${btnTextOnly}`}
            onClick={() => navigate(-1)}
          >
            {t("back")}
          </button>
        )}
      </div>
    </div>
  );
};
