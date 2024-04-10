import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const WhatYouCanDoBox = ({
  icon,
  title,
  desc,
  renderItem,
  children,
}: {
  icon: IconDefinition;
  title: string;
  desc: string;
  renderItem?: () => ReactNode;
  children: ReactNode;
}) => {
  const { t: tLp } = useTranslation("lp");

  return (
    <div className="bg-slate-50 rounded p-8 col-span-3 md:col-span-1 flex flex-col gap-6 items-start">
      <FontAwesomeIcon icon={icon} className="text-2xl text-blue-500" />
      <h3 className="text-xl font-semibold">{tLp(title)}</h3>
      {renderItem && renderItem()}
      <div className="text-base">{tLp(desc)}</div>
      {children}
    </div>
  );
};
