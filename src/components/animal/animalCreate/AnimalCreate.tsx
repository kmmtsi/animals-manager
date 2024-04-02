import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { handleCreateAnimalForm } from "../../../utils/animal/createAnimal";
import { convertErrToMsg } from "../../../utils/common/commonUtils";
import { AnimalFormData } from "../../../utils/common/definitions";
import { getPathToAnimals } from "../../../utils/common/pageUtils";
import { pageGapY } from "../../../utils/css";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { NewMsg } from "../../generalUI/NewMsg";
import { useToast } from "../../generalUI/toast/useToast";
import { AnimalForm } from "../AnimalForm";

export const AnimalCreate = () => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const showToast = useToast();
  const navigate = useNavigate();

  const { allAnimals, animalsMutator, animalsErr } = useFetchAnimals(user.uid);

  if (allAnimals) {
    return (
      <div className={pageGapY}>
        <Breadcrumb page="animalCreate" />
        <AnimalForm
          defaultName=""
          defaultSex=""
          defaultNote=""
          submitBtnText={t("createNew")}
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
              navigate(getPathToAnimals());
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        />
      </div>
    );
  }
  if (animalsErr) {
    return <NewMsg role="err">{animalsErr.message}</NewMsg>;
  }
};
