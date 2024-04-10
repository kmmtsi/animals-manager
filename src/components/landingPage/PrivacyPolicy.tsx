import { useTranslation } from "react-i18next";
import { lpContainer } from "../../utils/css";

export const PrivacyPolicy = () => {
  const { t: tCommon } = useTranslation();
  const { t } = useTranslation("privacyPolicy");

  const h2 = "text-2xl font-semibold border-b pt-12 pb-3";
  const p = "pt-5";
  const ol = "list-decimal list-inside pl-4";
  const li = "pt-5";

  const appName = tCommon("appName");

  return (
    <section className="text-base">
      <div className={lpContainer}>
        {/* 0 */}
        <div>
          <h1 className="text-3xl font-semibold">{tCommon("privacyPolicy")}</h1>
          <p className={p}>
            {t("0-p", { appName })}
          </p>
        </div>
        {/* 1 */}
        <div>
          <h2 className={h2}>{t("1-h")}</h2>
          <p className={p}>{t("1-p")}</p>
        </div>
        {/* 2 */}
        <div>
          <h2 className={h2}>{t("2-h")}</h2>
          <p className={p}>{t("2-p")}</p>
        </div>
        {/* 3 */}
        <div>
          <h2 className={h2}>{t("3-h")}</h2>
          <p className={p}>{t("3-p")}</p>
          <ol className={ol}>
            <li className={li}>{t("3-1")}</li>
            <li className={li}>{t("3-2")}</li>
            <li className={li}>{t("3-3")}</li>
            <li className={li}>{t("3-4")}</li>
            <li className={li}>{t("3-5")}</li>
            <li className={li}>{t("3-6")}</li>
            <li className={li}>{t("3-7")}</li>
            <li className={li}>{t("3-8")}</li>
          </ol>
        </div>
        {/* 4 */}
        <div>
          <h2 className={h2}>{t("4-h")}</h2>
          <ol className={ol}>
            <li className={li}>{t("4-1")}</li>
            <li className={li}>{t("4-2")}</li>
          </ol>
        </div>
        {/* 5 */}
        <div>
          <h2 className={h2}>{t("5-h")}</h2>
          <ol className={ol}>
            <li className={li}>
              {t("5-1")}
              <ol className={ol}>
                <li className={li}>{t("5-1-1")}</li>
                <li className={li}>{t("5-1-2")}</li>
                <li className={li}>{t("5-1-3")}</li>
                <li className={li}>
                  {t("5-1-4")}
                  <ol className={ol}>
                    <li className={li}>{t("5-1-4-1")}</li>
                    <li className={li}>{t("5-1-4-2")}</li>
                    <li className={li}>{t("5-1-4-3")}</li>
                    <li className={li}>{t("5-1-4-4")}</li>
                    <li className={li}>{t("5-1-4-5")}</li>
                  </ol>
                </li>
              </ol>
            </li>
            <li className={li}>
              {t("5-2")}
              <ol className={ol}>
                <li className={li}>{t("5-2-1")}</li>
                <li className={li}>{t("5-2-2")}</li>
                <li className={li}>{t("5-2-3")}</li>
              </ol>
            </li>
          </ol>
        </div>
        {/* 6 */}
        <div>
          <h2 className={h2}>{t("6-h")}</h2>
          <ol className={ol}>
            <li className={li}>
              {t("6-1")}
              <ol className={ol}>
                <li className={li}>{t("6-1-1")}</li>
                <li className={li}>{t("6-1-2")}</li>
                <li className={li}>{t("6-1-3")}</li>
              </ol>
            </li>
            <li className={li}>{t("6-2")}</li>
          </ol>
        </div>
        {/* 7 */}
        <div>
          <h2 className={h2}>{t("7-h")}</h2>
          <ol className={ol}>
            <li className={li}>{t("7-1")}</li>
            <li className={li}>{t("7-2")}</li>
            <li className={li}>{t("7-3")}</li>
          </ol>
        </div>
        {/* 8 */}
        <div>
          <h2 className={h2}>{t("8-h")}</h2>
          <ol className={ol}>
            <li className={li}>{t("8-1")}</li>
            <li className={li}>{t("8-2")}</li>
            <li className={li}>{t("8-3")}</li>
            <li className={li}>{t("8-4")}</li>
          </ol>
        </div>
        {/* 9 */}
        <div>
          <h2 className={h2}> {t("9-h")} </h2>
          <ol className={ol}>
            <li className={li}>{t("9-1")}</li>
            <li className={li}>{t("9-2")}</li>
          </ol>
        </div>
      </div>
    </section>
  );
};
