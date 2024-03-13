import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { getLocalDateString } from "../../utils/common/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TimeChip = ({
  timestamp,
  text,
  icon,
}: {
  timestamp: string;
  text: string;
  icon: IconDefinition;
}) => {
  return (
    <div className="text-xs bg-slate-100 px-2 py-1 text-slate-500 w-fit rounded">
      <FontAwesomeIcon icon={icon} className="mr-0.5" />
      <span>{text}：</span>
      {getLocalDateString(timestamp)}
    </div>
  );
};
