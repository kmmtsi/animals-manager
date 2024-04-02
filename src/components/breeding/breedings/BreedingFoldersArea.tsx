import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Folder } from "../../../utils/common/definitions";
import { getPathToBreedingsFolderPage } from "../../../utils/common/pageUtils";
import { hover } from "../../../utils/css";

export const BreedingFoldersArea = ({ folders }: { folders: Folder[] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="text-xs">{t("folder")}</div>
      <div className="flex gap-2">
        {folders.map((folder) => {
          return (
            <div
              key={folder.id}
              className={`rounded p-3 cursor-pointer bg-slate-100 ${hover}`}
              onClick={() => navigate(getPathToBreedingsFolderPage(folder.id))}
            >
              {folder.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
