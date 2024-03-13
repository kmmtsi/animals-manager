import { Td } from "../animalsList/Td";
import { getLocalDateString } from "../../utils/common/utils";

export const TdTimestamp = ({ timestamp }: { timestamp: string }) => {
  return <Td>{getLocalDateString(timestamp)}</Td>;
};
