import { ReactNode } from "react";
import { Animal, Breeding } from "../../../../utils/common/definitions";

export const Items = <T extends Animal | Breeding>({
  items,
  renderNoItem,
  renderTableView,
}: {
  items: T[];
  renderNoItem: () => ReactNode;
  renderTableView: () => ReactNode;
}) => {
  if (items.length > 0) {
    return renderTableView();
  } else {
    return renderNoItem();
  }
};
