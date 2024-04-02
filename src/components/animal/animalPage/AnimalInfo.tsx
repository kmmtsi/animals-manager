import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { KeyedMutator } from "swr";
import { handleDeleteAnimals } from "../../../utils/animal/deleteAnimals";
import {
  convertErrToMsg,
  convertTsToLocalDateString,
} from "../../../utils/common/commonUtils";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import {
  getPathToAnimals,
  getPathToAnimalsFolderPage,
  getPathToBreedingCreate,
  getPathToBreedingPage,
} from "../../../utils/common/pageUtils";
import {
  btn,
  btnOutlineBlue,
  btnOutlineRed,
  fieldGapY,
  formGapY,
  hover,
  infoBox,
  msgLikeBtn,
} from "../../../utils/css";
import { BreedingGrid } from "../../breeding/BreedingGrid";
import { useToast } from "../../generalUI/toast/useToast";

export const AnimalInfo = ({
  animal,
  setIsUpdate,
  allBreedings,
  allAnimals,
  allAnimalsFolders,
  breedingsMutator,
  animalsMutator,
  animalsFoldersMutator,
}: {
  animal: Animal;
  setIsUpdate: Dispatch<SetStateAction<boolean>>;
  allBreedings: Breeding[];
  allAnimals: Animal[];
  allAnimalsFolders: Folder[];
  breedingsMutator: KeyedMutator<Breeding[]>;
  animalsMutator: KeyedMutator<Animal[]>;
  animalsFoldersMutator: KeyedMutator<Folder[]>;
}) => {
  const user = useOutletContext<User>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showToast = useToast();

  const breedingAsChild = animal.breedingIdAsChild
    ? (allBreedings.find(
        (breeding) => breeding.id === animal.breedingIdAsChild
      ) as Breeding)
    : null;

  const breedingsAsParent = animal.breedingIdsAsParent.map(
    (breedingId) =>
      allBreedings.find((breeding) => breeding.id === breedingId) as Breeding
  );

  return (
    <div className={formGapY}>
      {/* folder */}
      <div className="flex gap-1">
        {animal.folderIds.map((folderId, i) => {
          const folder = allAnimalsFolders.find(
            (folder) => folder.id === folderId
          ) as Folder;
          return (
            <Link
              key={i}
              to={getPathToAnimalsFolderPage(folderId)}
              className={`flex items-center gap-x-1 rounded border px-2 py-1 w-fit text-xs bg-slate-50 ${hover}`}
            >
              <FontAwesomeIcon icon={faFolder} className="text-slate-600" />
              <div>{folder.name}</div>
            </Link>
          );
        })}
      </div>
      {/* メモ */}
      <div className={fieldGapY}>
        <div>{t("note")}</div>
        <div className={infoBox}>{animal.note}</div>
      </div>
      {/* breedingAsChild */}
      <div className={fieldGapY}>
        <div>{t("breedingAsChild")}</div>
        {breedingAsChild ? (
          <Link
            to={getPathToBreedingPage(breedingAsChild.id)}
            className={`${infoBox} block ${hover}`}
          >
            <BreedingGrid miniBreeding={breedingAsChild} />
          </Link>
        ) : (
          <Link to={getPathToBreedingCreate()} className={msgLikeBtn}>
            {t("createBreeding")}
          </Link>
        )}
      </div>
      {/* breedingAsParent */}
      <div className={fieldGapY}>
        <div>{t("breedingsAsParent")}</div>
        {breedingsAsParent && breedingsAsParent.length > 0 ? (
          breedingsAsParent.map((br, i) => (
            <Link
              key={i}
              className={`${infoBox} block ${hover}`}
              to={getPathToBreedingPage(br.id)}
            >
              <BreedingGrid key={i} miniBreeding={br} />
            </Link>
          ))
        ) : (
          <Link to={getPathToBreedingCreate()} className={msgLikeBtn}>
            {t("createBreeding")}
          </Link>
        )}
      </div>
      {/* 作成日 */}
      <div className={fieldGapY}>
        <div>{t("createdAt")}</div>
        <div>{convertTsToLocalDateString(animal.createdAt)}</div>
      </div>
      {/* 作成者 */}
      <div className={fieldGapY}>
        <div>{t("createdBy")}</div>
        <div>{animal.createdBy}</div>
      </div>
      {/* 更新日 */}
      <div className={fieldGapY}>
        <div>{t("updatedAt")}</div>
        <div>{convertTsToLocalDateString(animal.updatedAt)}</div>
      </div>
      {/* 更新者 */}
      <div className={fieldGapY}>
        <div>{t("updatedBy")}</div>
        <div>{animal.updatedBy}</div>
      </div>
      <div className="flex gap-x-2">
        {/* 更新ボタン */}
        <button
          type="button"
          className={`${btn} ${btnOutlineBlue}`}
          onClick={() => setIsUpdate(true)}
        >
          {t("update")}
        </button>
        {/* 削除ボタン */}
        <button
          type="button"
          className={`${btn} ${btnOutlineRed}`}
          onClick={async () => {
            try {
              // 削除処理
              await handleDeleteAnimals(
                [animal],
                user.uid,
                allAnimals,
                allBreedings,
                allAnimalsFolders,
                animalsMutator,
                breedingsMutator,
                animalsFoldersMutator
              );
              showToast(t("animalDeleted"));
              navigate(getPathToAnimals());
            } catch (err) {
              showToast(convertErrToMsg(err));
            }
          }}
        >
          {t("deleteAnimal")}
        </button>
      </div>
    </div>
  );
};
