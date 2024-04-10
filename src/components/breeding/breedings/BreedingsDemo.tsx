import { Dispatch, SetStateAction } from "react";
import { Breeding } from "../../../utils/common/definitions";
import { DemoWindow } from "../../landingPage/tryMe/tryMeUtils/tryMeUtils";
import { BreedingsBase } from "./BreedingsBase";

export const BreedingsDemo = ({
  allBreedings,
  setCurrentBreeding,
  setCurrentWindow,
}: {
  allBreedings: Breeding[];
  setCurrentBreeding: Dispatch<SetStateAction<Breeding>>;
  setCurrentWindow: Dispatch<SetStateAction<DemoWindow>>;
}) => {
  return (
    <BreedingsBase
      breedings={allBreedings}
      handleDeleteBreedings={async () => {}}
      hideCheckbox={true}
      handleBreedingClick={(id) => {
        const breeding = allBreedings.find(
          (breeding) => breeding.id === id
        ) as Breeding;
        setCurrentBreeding(breeding);
        setCurrentWindow("breedingPage");
      }}
    />
  );
};
