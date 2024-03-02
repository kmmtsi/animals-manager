import { Td } from "./Td";
import { NameAndSex } from "./NameAndSex";
import { getAnimalById } from "../../utils/animal/utils";
import { MiniAnimal } from "../../utils/animal/definitions";

export const FamilyTd = ({
  family,
  allMiniAnimals,
}: {
  family: string[];
  allMiniAnimals: MiniAnimal[];
}) => {
  return (
    <Td>
      {family.map((member) => {
        const miniMember = getAnimalById(member, allMiniAnimals);
        return <NameAndSex key={member} animal={miniMember} isLink={true} />;
      })}
    </Td>
  );
};
