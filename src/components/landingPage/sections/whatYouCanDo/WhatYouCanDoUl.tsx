import { useTranslation } from "react-i18next";

export const WhatYouCanDoUl = ({
  developed,
  developing,
}: {
  developed: string[];
  developing: string[];
}) => {
  const { t } = useTranslation();
  const { t: tLp } = useTranslation("lp");

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs text-slate-500 font-semibold pb-1">
          {tLp("features.availableFields")}
        </h4>
        <ul className="flex flex-wrap gap-1 text-slate-500">
          {developed.map((item, i) => (
            <li key={i} className="bg-slate-200 w-fit px-1.5 py-0.5 rounded">
              {t(item)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs text-slate-500 font-semibold pb-1">
          {tLp("features.developingFields")}
        </h4>
        <ul className="flex flex-wrap gap-1 text-slate-500">
          {developing.map((item, i) => (
            <li key={i} className="bg-slate-200 w-fit px-1.5 py-0.5 rounded">
              {t(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
