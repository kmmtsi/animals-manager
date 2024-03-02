import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hover } from "../../utils/css";
import { MouseEventHandler } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const ClickableIcon = ({
  icon,
  onClick,
}: {
  icon: IconDefinition;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    className={`flex items-center justify-center rounded-full w-6 aspect-square ${hover}`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
);
