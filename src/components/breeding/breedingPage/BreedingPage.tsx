import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { handleDeleteBreedings } from "../../../utils/breeding/deleteBreedings";
import { handleUpdateBreedingForm } from "../../../utils/breeding/updateBreeding";
import {
  getPathToAllBreedings,
  getPathToAnimalPage,
} from "../../../utils/common/pageUtils";
import { pageGapY } from "../../../utils/css";
import { useFetchBreedingsFolders } from "../../../utils/folder/folderUtils";
import { Breadcrumb } from "../../generalUI/Breadcrumb";
import { Msg } from "../../generalUI/Msg";
import { BreedingBase } from "./BreedingBase";

export const BreedingPage = () => {
  const user = useOutletContext<User>();
  const { breedingId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
    user.uid
  );
  const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(user.uid);

  const { allBreedingsFolders, breedingsFoldersErr, breedingsFoldersMutator } =
    useFetchBreedingsFolders(user.uid);

  if (allBreedings && allAnimals && allBreedingsFolders && breedingId) {
    const breeding = allBreedings.find(
      (breeding) => breeding.id === breedingId
    );

    if (breeding) {
      return (
        <div className={pageGapY}>
          <Breadcrumb page={"breedingPage"} dynamic={breeding.id} />
          <BreedingBase
            breeding={breeding}
            allAnimals={allAnimals}
            allBreedingsFolders={allBreedingsFolders}
            disableBackBtn={false}
            onAnimalClick={(animalId) =>
              navigate(getPathToAnimalPage(animalId))
            }
            deleteItemBtnConfig={{
              label: "deleteBreeding",
              handleDeleteItem: async () => {
                await handleDeleteBreedings(
                  [breeding],
                  user.uid,
                  allBreedings,
                  allAnimals,
                  allBreedingsFolders,
                  breedingsMutator,
                  animalsMutator,
                  breedingsFoldersMutator
                );
              },
              toastMsg: "breedingDeleted",
              navigateTo: getPathToAllBreedings(),
            }}
            handleUpdateBreeding={async (data) => {
              await handleUpdateBreedingForm(
                data,
                user.uid,
                allAnimals,
                allBreedings,
                breeding,
                { mutators: { animalsMutator, breedingsMutator } }
              );
            }}
          />
        </div>
      );
    } else {
      return <Msg role="err">{t("breedingNotFound")}</Msg>;
    }
  }
  if (breedingsErr || animalsErr || breedingsFoldersErr) {
    return (
      <Msg role="err">
        {breedingsErr?.message ||
          animalsErr?.message ||
          breedingsFoldersErr?.message}
      </Msg>
    );
  }
};
