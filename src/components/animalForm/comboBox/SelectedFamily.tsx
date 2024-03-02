import { Chip } from "../../generalUI/Chip";
import { NameAndSex } from "../../animalsList/NameAndSex";
import { Dispatch, SetStateAction } from "react";
import { MiniAnimal } from "../../../utils/animal/definitions";

export const SelectedFamily = ({
  miniFamily,
  setMiniFamily,
  className = "",
}: {
  miniFamily: MiniAnimal[];
  setMiniFamily: Dispatch<SetStateAction<MiniAnimal[]>>;
  className?: string;
}) => {
  return (
    <ul className={`flex flex-wrap gap-1 ${className}`}>
      {miniFamily.map((member, i) => (
        <li key={i}>
          <Chip
            onDelete={() => {
              // 選択されたアイテムと同名のアイテムをfamilyから除外
              const newSelectedItems = miniFamily.filter(
                (item) => item.name !== member.name
              );
              setMiniFamily(newSelectedItems);
            }}
          >
            <NameAndSex animal={member} />
          </Chip>
        </li>
      ))}
    </ul>
  );
};
