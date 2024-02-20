// import { Item } from "./ComboBox";
// import { handleSelect } from "./utils";
// import { Dispatch, SetStateAction, forwardRef, ForwardedRef } from "react";
// import { Key } from "../../Key";
// import { css } from "../../../../utils/css";

// export const Suggestions = forwardRef(
//   (
//     {
//       setRegex,
//       originalItems,
//       setInputValue,
//       selectedItems,
//       setSelectedItems,
//       suggestItems,
//       setSuggestItems,
//       maxSelect,
//       ngItems,
//     }: {
//       setRegex: Dispatch<SetStateAction<RegExp>>;
//       originalItems: Item[];
//       setInputValue: Dispatch<SetStateAction<string>>;
//       suggestItems: Item[];
//       setSuggestItems: Dispatch<SetStateAction<Item[]>>;
//       selectedItems: Item[];
//       setSelectedItems: Dispatch<SetStateAction<Item[]>>;
//       maxSelect: number;
//       ngItems: Item[];
//     },
//     dialogRef: ForwardedRef<HTMLDialogElement>
//   ) => {
//     const handleSelectWrapper = (selectedItem: Item) =>
//       handleSelect(
//         selectedItem,
//         selectedItems,
//         setSelectedItems,
//         setInputValue,
//         setRegex,
//         originalItems,
//         setSuggestItems,
//         dialogRef,
//         maxSelect,
//         ngItems
//       );

//     return (
//       <>
//         <div className="h-48 md:h-96 overflow-y-auto">
//           <div className="px-2 py-1 text-xs text-slate-500 cursor-default">
//             {suggestItems.length > 0 ? (
//               <div className="flex gap-x-2">
//                 <div>リストから選択</div>
//                 <div className="hidden lg:block">
//                   <Key>Tab</Key> 下に移動 / <Key>Shift</Key>+<Key>Tab</Key>{" "}
//                   上に移動
//                 </div>
//               </div>
//             ) : (
//               <div>候補がありません</div>
//             )}
//           </div>
//           <div role="listbox">
//             {suggestItems?.map((suggestItem, i) => (
//               // サジェストアイテム
//               <div
//                 key={i}
//                 role="option"
//                 tabIndex={0}
//                 className={`px-2 py-3 cursor-pointer hover:bg-slate-100 border-b text-sm ${css.focus}`}
//                 onClick={() => handleSelectWrapper(suggestItem)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     // タブでfocusした時にEnterで選択可
//                     handleSelectWrapper(suggestItem);
//                   }
//                 }}
//               >
//                 {suggestItem.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </>
//     );
//   }
// );
