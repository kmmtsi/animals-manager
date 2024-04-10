import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  Animal,
  Breeding,
  BreedingFormData,
  MiniAnimal,
} from "../../../utils/common/definitions";
import { useToast } from "../../generalUI/toast/useToast";
import { BreedingForm } from "../BreedingForm";

export type HandleUpdateBreeding = (data: BreedingFormData) => Promise<void>;

export const BreedingUpdate = ({
  prevBreeding,
  setIsUpdate,
  allAnimals,
  handleUpdateBreeding,
}: {
  prevBreeding: Breeding;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allAnimals: Animal[];
  handleUpdateBreeding: HandleUpdateBreeding;
}) => {
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
          await handleUpdateBreeding({
            parents,
            children,
            ...data,
          } as BreedingFormData);
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
