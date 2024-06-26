import { useTranslation } from "react-i18next";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { common } from "../../utils/css";
import { getPathToAllAnimals } from "../../utils/common/pageUtils";
import { Msg } from "./Msg";

export const ErrPage = () => {
  const err = useRouteError();
  const { t } = useTranslation();

  return (
    // commonのcssを適用する必要あり
    /* 画面 */
    <div className={`flex items-center justify-center h-screen ${common}`}>
      {/* 表示ボックス */}
      <div className="space-y-3 max-w-80">
        {isRouteErrorResponse(err) ? (
          <>
            <h1 className="text-4xl font-medium">{err.status}</h1>
            <div>{err.statusText}</div>
            <Msg role="err">{t("pageNotFound")}</Msg>
          </>
        ) : err instanceof Error ? (
          <>
            <h1 className="text-4xl font-medium">{t("error")}</h1>
            <div className="">{t("errorOccured")}</div>
            <Msg role="err">{err.message}</Msg>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-medium">{t("error")}</h1>
            <div className="">{t("errorOccured")}</div>
          </>
        )}
        <Link
          to={getPathToAllAnimals()}
          className="block text-slate-500 underline underline-offset-4"
        >
          {t("backToAnimals")}
        </Link>
      </div>
    </div>
  );
};
