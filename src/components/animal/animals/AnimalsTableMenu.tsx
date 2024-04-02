// import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { User } from "firebase/auth";
// import { useTranslation } from "react-i18next";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import { Animal } from "../../../utils/common/definitions";
// import { handleDeleteAnimals } from "../../../utils/animal/handleDeleteAnimals";
// import { AnimalFsToS, SortMethod } from "../../../utils/animal/animalUtils";
// import { convertErrToMsg } from "../../../utils/common/commonUtils";
// import { useFetchAnimals } from "../../../utils/animal/animalUtils";
// import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
// import { btn, btnBlue, tableMenu } from "../../../utils/css";
// import { getPathToAnimalCreate } from "../../../utils/common/pageUtils";
// import { FsToSPreference } from "../../generalUI/FsToSPreference";
// import { NewMsg } from "../../generalUI/NewMsg";
// import { TableMenuLeft } from "../../generalUI/TableMenuLeft";
// import { useToast } from "../../generalUI/toast/useToast";

// export const AnimalsTableMenu = ({
//   checkedItems,
//   clearCheck,
//   sortMethod,
//   fsToS,
//   handleCheckFToS,
// }: {
//   checkedItems: Animal[];
//   clearCheck: () => void;
//   sortMethod: SortMethod;
//   fsToS: AnimalFsToS;
//   handleCheckFToS: (field: keyof AnimalFsToS) => void;
// }) => {
//   const user = useOutletContext<User>();
//   const { t } = useTranslation();
//   const showToast = useToast();
//   const navigate = useNavigate();

//   const { allAnimals, animalsErr, animalsMutator } = useFetchAnimals(user.uid);

//   const { allBreedings, breedingsErr, breedingsMutator } = useFetchBreedings(
//     user.uid
//   );

//   if (allAnimals && allBreedings) {
//     return (
//       <div className={tableMenu}>
//         {/* 左側エリア */}
//         <TableMenuLeft
//           rowCounts={allAnimals.length}
//           checkedItemsLength={checkedItems.length}
//           onDeleteClick={async () => {
//             // TODO
//             try {
//               await handleDeleteAnimals(
//                 checkedItems,
//                 user.uid,
//                 allAnimals,
//                 allBreedings,
//                 animalsMutator,
//                 breedingsMutator
//               );
//               showToast(t("animalsDeleted"));
//               clearCheck();
//             } catch (err) {
//               showToast(convertErrToMsg(err));
//             }
//           }}
//         />
//         {/* フィルター状況 */}
//         <div className="flex items-center justify-center text-xs text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-full">
//           <span>並べ替え：</span>
//           <span className="mr-1">
//             {sortMethod.target === "name"
//               ? "名前"
//               : sortMethod.target === "createdAt"
//               ? "登録日"
//               : "更新日"}
//           </span>
//           <FontAwesomeIcon
//             icon={sortMethod.order === "asc" ? faArrowUp : faArrowDown}
//             className=""
//           />
//         </div>
//         {/* 右側エリア */}
//         <div className="flex gap-x-2">
//           {/* 表示設定 */}
//           <FsToSPreference fsToS={fsToS} handleCheckFToS={handleCheckFToS} />
//           {/* 新規作成 */}
//           <button
//             type="button"
//             className={`${btn} ${btnBlue}`}
//             onClick={() => navigate(getPathToAnimalCreate())}
//           >
//             {t("createAnimal")}
//           </button>
//         </div>
//       </div>
//     );
//   }
//   if (animalsErr || breedingsErr) {
//     return (
//       <NewMsg role="err">{animalsErr?.message || breedingsErr?.message}</NewMsg>
//     );
//   }
// };
