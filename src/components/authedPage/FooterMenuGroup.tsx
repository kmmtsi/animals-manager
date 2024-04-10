import { Fragment, MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { textLinkHover } from "../../utils/css";

type MenuItem = {
  label: string;
  link?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const FooterMenuGroup = ({
  group,
  items,
}: {
  group: string;
  items: MenuItem[];
}) => {
  const { t } = useTranslation();
  return (
    <div className="col-span-6 sm:col-span-3">
      <div className="font-semibold pb-4">{t(group)}</div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <Fragment key={i}>
            {item.onClick && (
              <button
                type="button"
                className={`${textLinkHover} w-fit`}
                onClick={item.onClick}
              >
                {t(item.label)}
              </button>
            )}
            {item.link !== undefined && (
              <Link to={item.link} className={`${textLinkHover} w-fit`}>
                {t(item.label)}
              </Link>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
