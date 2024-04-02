import { MiniAnimal } from "../../utils/common/definitions";
import { NameAndSex } from "../animal/NameAndSex";

export const Children = ({
  children,
  isAnimalLink,
}: {
  children: MiniAnimal[];
  isAnimalLink?: boolean;
}) => {
  return children.length > 0 ? (
    <div className="flex gap-1 flex-wrap">
      {children.map((child, i) => (
        <div key={i} className="flex">
          <NameAndSex animal={child} isLink={isAnimalLink} />
          {i !== children.length - 1 && <span>,</span>}
        </div>
      ))}
    </div>
  ) : (
    <div></div>
  );
};
