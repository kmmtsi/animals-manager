import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getPathToSignUp } from "../../../utils/common/pageUtils";
import { lpContainer, lpSectionFlex, lpSectionTitle } from "../../../utils/css";
import imgUrl from "../../../assets/cat.png";

export const Price = () => {
  const { t } = useTranslation();
  const { t: tLp } = useTranslation("lp");

  return (
    <section className="py-14">
      <div className={`${lpContainer} ${lpSectionFlex}`}>
        {/* タイトル */}
        <h2 className={`${lpSectionTitle} text-yellow-500`}>
          {tLp("price.title")}
        </h2>
        <div>
          <img src={imgUrl} className="max-w-24" />
        </div>
        {/* 概要 */}
        <div className="flex flex-col items-center gap-4 sm:text-center">
          <div className="text-base space-y-2">
            <div>{tLp("price.desc1")}</div>
          </div>
        </div>
        {/* ボタン */}
        <Link
          to={getPathToSignUp()}
          type="button"
          className={`px-6 py-3 rounded text-white font-bold bg-yellow-500 hover:bg-yellow-600 w-fit`}
        >
          {t("createAccount")}
        </Link>
      </div>
    </section>
  );
};
