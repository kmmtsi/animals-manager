import { MiniAnimal } from "../../utils/common/definitions";
import { NameAndSex } from "./NameAndSex";

export const Children = ({ children }: { children: MiniAnimal[] }) => {
  return (
    <div className="flex gap-x-1">
      {children.map((child, i) => (
        <div key={i} className="flex">
          <NameAndSex animal={child} />
          {i !== children.length - 1 && <span>,</span>}
        </div>
      ))}
    </div>
  );
};
