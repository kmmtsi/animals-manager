import { User } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { handleCreateAnimalForm } from "../../../utils/animal/createAnimal";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import { AnimalFormData } from "../../../utils/common/definitions";
import {
  getPNForAnimalCreate,
  getPathToAllAnimals,
} from "../../../utils/common/pageUtils";
import { pageGapY, pageTitle } from "../../../utils/css";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { Msg } from "../../generalUI/Msg";
import { useToast } from "../../generalUI/toast/useToast";
import { AnimalCreate } from "./AnimalCreate";

export const AnimalCreatePage = () => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(user.uid);

  if (allAnimals) {
    return (
      <div className={pageGapY}>
        <Breadcrumb page="animalCreate" />
        <h1 className={pageTitle}>{t(getPNForAnimalCreate())}</h1>
        <AnimalCreate
          name={name}
          setName={setName}
          allAnimals={allAnimals}
          onCancelClick={() => navigate(-1)}
          formOperation={async (data) => {
            try {
              await handleCreateAnimalForm(
                data as AnimalFormData,
                user.uid,
                allAnimals,
                animalsMutator
              );
              showToast(t("animalCreated"));
              navigate(getPathToAllAnimals());
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        />
      </div>
    );
  }
  if (animalsErr) {
    return <Msg role="err">{animalsErr.message}</Msg>;
  }
};
