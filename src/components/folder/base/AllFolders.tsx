import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Animal, Breeding, Folder } from "../../../utils/common/definitions";
import {
  getPathToAnimalsFolderCreate,
  getPathToAnimalsFolderPage,
  getPathToBreedingsFolderCreate,
  getPathToBreedingsFolderPage,
} from "../../../utils/common/pageUtils";
import {
  btn,
  btnBlue,
  hover,
  pageGapY,
  pageTitle,
  titleAndBtn,
} from "../../../utils/css";
import { Breadcrumb } from "../../generalUI/Breadcrumb";

export const AllFolders = <T extends Animal | Breeding>({
  type,
  allFolders,
}: {
  type: T extends Animal ? "animalsFolder" : "breedingsFolder";
  allFolders: Folder[];
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={pageGapY}>
      <Breadcrumb
        page={
          type === "animalsFolder" ? "allAnimalsFolders" : "allBreedingsFolders"
        }
      />
      <div className={titleAndBtn}>
        <h1 className={pageTitle}>
          {t(
            type === "animalsFolder"
              ? "allAnimalsFolders"
              : "allBreedingsFolders"
          )}
        </h1>
        {/* 新規作成ボタン */}
        <button
          type="button"
          className={`${btn} ${btnBlue}`}
          onClick={() =>
            navigate(
              type === "animalsFolder"
                ? getPathToAnimalsFolderCreate()
                : getPathToBreedingsFolderCreate()
            )
          }
        >
          {t("createFolder")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {allFolders.length > 0 ? (
          allFolders.map((folder) => {
            return (
              <div
                key={folder.id}
                className={`flex gap-x-2 items-center col-span-3 md:col-span-1 border p-3 rounded cursor-pointer bg-slate-50 ${hover}`}
                onClick={() =>
                  navigate(
                    type === "animalsFolder"
                      ? getPathToAnimalsFolderPage(folder.id)
                      : getPathToBreedingsFolderPage(folder.id)
                  )
                }
              >
                <FontAwesomeIcon icon={faFolder} className="text-slate-800" />
                <div className="font-semibold">{folder.name}</div>
              </div>
            );
          })
        ) : (
          <div>{t("noFolderCreated")}</div>
        )}
      </div>
    </div>
  );
};
