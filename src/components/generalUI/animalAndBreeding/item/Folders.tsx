import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Folder } from "../../../../utils/common/definitions";
import { hover } from "../../../../utils/css";

export const Folders = ({
  folderIds,
  allFolders,
  getPathToFolderPage,
}: {
  folderIds: string[];
  allFolders: Folder[];
  getPathToFolderPage: (id: string) => string;
}) => {
  return (
    <>
      {folderIds.length > 0 && (
        <div className="flex gap-1">
          {folderIds.map((folderId, i) => {
            const folder = allFolders.find(
              (folder) => folder.id === folderId
            ) as Folder;
            return (
              <Link
                key={i}
                to={getPathToFolderPage(folderId)}
                className={`flex items-center gap-x-1 rounded border px-2 py-1 w-fit text-xs bg-slate-50 ${hover}`}
              >
                <FontAwesomeIcon icon={faFolder} className="text-slate-600" />
                <div>{folder.name}</div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};
