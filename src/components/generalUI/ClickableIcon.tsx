import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler } from "react";
import { hover } from "../../utils/css";

export const ClickableIcon = ({
  icon,
  onClick,
}: {
  icon: IconDefinition;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    className={`rounded-full w-7 aspect-square ${hover}`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
);
