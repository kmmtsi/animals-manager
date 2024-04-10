import { User } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { handleCreateBreedingForm } from "../../../utils/breeding/createBreeding";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import {
  BreedingFormData,
  MiniAnimal,
} from "../../../utils/common/definitions";
import {
  getPNForBreedingCreate,
  getPathToAllBreedings,
} from "../../../utils/common/pageUtils";
import { pageGapY, pageTitle } from "../../../utils/css";
import { State } from "../../animal/animalPage/AnimalPage";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { Msg } from "../../generalUI/Msg";
import { useToast } from "../../generalUI/toast/useToast";
import { BreedingCreate } from "./BreedingCreate";

export const BreedingCreatePage = () => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();
  const state = useLocation().state as State | null;

  const [parents, setParents] = useState<MiniAnimal[]>(
    state?.type === "parent" ? [state.miniAnimal] : []
  );
  const [children, setChildren] = useState<MiniAnimal[]>(
    state?.type === "child" ? [state.miniAnimal] : []
  );

  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(user.uid);
  const { allBreedings, breedingsMutator, breedingsErr } = useFetchBreedings(
    user.uid
  );

  if (allAnimals && allBreedings) {
    return (
      <div className={pageGapY}>
        <Breadcrumb page={"breedingCreate"} />
        <h1 className={pageTitle}>{t(getPNForBreedingCreate())}</h1>
        <BreedingCreate
          allAnimals={allAnimals}
          parents={parents}
          children={children}
          setParents={setParents}
          setChildren={setChildren}
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
                {
                  mutators: { animalsMutator, breedingsMutator },
                }
              );
              // 書き込み結果
              showToast(t("breedingCreated"));
              navigate(getPathToAllBreedings());
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        />
      </div>
    );
  }
  if (animalsErr || breedingsErr) {
    return <Msg role="err">{animalsErr?.message || breedingsErr?.message}</Msg>;
  }
};
