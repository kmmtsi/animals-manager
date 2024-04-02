// import { MouseEventHandler } from "react";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import { btn, btnBlue, pageTitle, titleAndBtn } from "../../utils/css";

// export const BreedingTtlAndBtns = ({
//   ttl,
//   btnText,
//   btnOnClick,
// }: {
//   ttl: string;
//   btnText: string;
//   btnOnClick: MouseEventHandler<HTMLButtonElement>;
// }) => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   return (
//     <div className={titleAndBtn}>
//       <h1 className={pageTitle}>{ttl}</h1>
//       {/* 新規作成 */}
//       <button
//         type="button"
//         className={`${btn} ${btnBlue}`}
//         onClick={btnOnClick}
//       >
//         {btnText}
//       </button>
//     </div>
//   );
// };
