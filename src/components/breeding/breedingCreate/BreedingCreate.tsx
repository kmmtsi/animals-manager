import { User } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { handleCreateBreedingForm } from "../../../utils/breeding/createBreeding";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  BreedingFormData,
  MiniAnimal,
} from "../../../utils/common/definitions";
import { getPathToBreedings } from "../../../utils/common/pageUtils";
import { pageGapY } from "../../../utils/css";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { NewMsg } from "../../generalUI/NewMsg";
import { useToast } from "../../generalUI/toast/useToast";
import { BreedingForm } from "../BreedingForm";

export const BreedingCreate = () => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();

  const [parents, setParents] = useState<MiniAnimal[]>([]);
  const [children, setChildren] = useState<MiniAnimal[]>([]);

  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(user.uid);
  const { allBreedings, breedingsMutator, breedingsErr } = useFetchBreedings(
    user.uid
  );

  if (allAnimals && allBreedings) {
    return (
      <div className={pageGapY}>
        <Breadcrumb page={"breedingCreate"} />
        <BreedingForm
          parents={parents}
          children={children}
          defaultStatus=""
          defaultNote=""
          defaultStartDate=""
          defaultEndDate=""
          allAnimals={allAnimals}
          setParents={setParents}
          setChildren={setChildren}
          submitBtnText={t("createNew")}
          onCancelClick={() => navigate(-1)}
          formOperation={async (data) => {
            try {
              await handleCreateBreedingForm(
                {
                  parents,
                  children,
                  ...(data as Omit<BreedingFormData, "parents" | "children">),
                },
                user.uid,
                allAnimals,
                allBreedings,
                animalsMutator,
                breedingsMutator
              );
              // 書き込み結果
              showToast(t("breedingCreated"));
              navigate(getPathToBreedings());
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        />
      </div>
    );
  }
  if (animalsErr || breedingsErr) {
    return (
      <NewMsg role="err">{animalsErr?.message || breedingsErr?.message}</NewMsg>
    );
  }
};
