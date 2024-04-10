import { Trans, useTranslation } from "react-i18next";
import { lpContainer, lpSectionFlex } from "../../../utils/css";
import { TryMe } from "../tryMe/TryMe";

export const Hero = () => {
  const { t: tLp } = useTranslation("lp");

  return (
    <section className="pb-10">
      <div className={`${lpContainer} ${lpSectionFlex}`}>
        {/* タイトル */}
        <h2 className={`text-4xl font-bold text-center w-full`}>
          <Trans
            i18nKey={"lp:hero.title"}
            components={{ span: <span className="inline-block" /> }}
          />
        </h2>
        {/* 概要 */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="md:text-center text-base space-y-2">
            <div>{tLp("hero.desc1")}</div>
            <div>{tLp("hero.desc2")}</div>
          </div>
        </div>
        <TryMe />
      </div>
    </section>
  );
};
