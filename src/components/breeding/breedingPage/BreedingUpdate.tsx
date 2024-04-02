import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import { handleUpdateBreedingForm } from "../../../utils/breeding/updateBreeding";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  Animal,
  Breeding,
  BreedingFormData,
  MiniAnimal,
} from "../../../utils/common/definitions";
import { useToast } from "../../generalUI/toast/useToast";
import { BreedingForm } from "../BreedingForm";

export const BreedingUpdate = ({
  prevBreeding,
  setIsUpdate,
  allBreedings,
  allAnimals,
  breedingsMutator,
  animalsMutator,
}: {
  prevBreeding: Breeding;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allBreedings: Breeding[];
  allAnimals: Animal[];
  breedingsMutator: KeyedMutator<Breeding[]>;
  animalsMutator: KeyedMutator<Animal[]>;
}) => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const showToast = useToast();

  const [parents, setParents] = useState<MiniAnimal[]>(prevBreeding.parents);
  const [children, setChildren] = useState<MiniAnimal[]>(prevBreeding.children);

  return (
    <BreedingForm
      parents={parents}
      children={children}
      defaultStatus={prevBreeding.status}
      defaultStartDate={prevBreeding.startDate}
      defaultEndDate={prevBreeding.endDate}
      defaultNote={prevBreeding.note}
      allAnimals={allAnimals}
      setParents={setParents}
      setChildren={setChildren}
      submitBtnText={t("update")}
      onCancelClick={() => {
        setIsUpdate(false);
      }}
      formOperation={async (data) => {
        try {
          await handleUpdateBreedingForm(
            {
              parents,
              children,
              ...(data as Omit<BreedingFormData, "parents" | "children">),
            },
            user.uid,
            allAnimals,
            allBreedings,
            animalsMutator,
            breedingsMutator,
            prevBreeding
          );
          // 書き込み結果
          showToast(t("breedingUpdated"));
          // リセット
          setIsUpdate(false);
        } catch (err) {
          showToast(convertErrToMsg(err));
        }
      }}
    />
  );
};
