// import {
//   faArrowDown,
//   faArrowUp,
//   faEllipsis,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Dispatch, ReactNode, SetStateAction, useState } from "react";
// import { SortMethod, SortTarget } from "../../../utils/animal/animalUtils";
// import { hover, th } from "../../../utils/css";

// export const Th = ({
//   sortTarget,
//   setSortMethod,
//   className = "",
//   children,
// }: {
//   sortTarget?: SortTarget;
//   setSortMethod?: Dispatch<SetStateAction<SortMethod>>;
//   className?: string;
//   children?: ReactNode;
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   return (
//     <>
//       {sortTarget && setSortMethod ? (
//         // sortに関するpropsが渡された場合
//         <th className={`relative ${th} ${className}`}>
//           <button
//             type="button"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className={`text-start p-2 w-full flex items-center justify-between ${hover}`}
//           >
//             {children}
//             <FontAwesomeIcon icon={faEllipsis} />
//           </button>
//           {isMenuOpen && (
//             <>
//               {/* 背景 */}
//               <div
//                 className="fixed z-10 inset-0 cursor-default"
//                 onClick={() => setIsMenuOpen(false)}
//               />
//               {/* メニュー */}
//               <div className="absolute z-10 top-full left-0 flex flex-col gap-y-1 w-full bg-white shadow border p-2 rounded">
//                 <button
//                   type="button"
//                   className={`rounded text-start py-1 px-2 w-full ${hover}`}
//                   onClick={() => {
//                     setIsMenuOpen(false);
//                     setSortMethod({ target: sortTarget, order: "asc" });
//                   }}
//                 >
//                   <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
//                   昇順
//                 </button>
//                 <button
//                   type="button"
//                   className={`rounded text-start py-1 px-2 w-full ${hover}`}
//                   onClick={() => {
//                     setIsMenuOpen(false);
//                     setSortMethod({ target: sortTarget, order: "desc" });
//                   }}
//                 >
//                   <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
//                   降順
//                 </button>
//               </div>
//             </>
//           )}
//         </th>
//       ) : (
//         <th className={`${th} ${className}`}>{children}</th>
//       )}
//     </>
//   );
// };
