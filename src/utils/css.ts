// App.tsx, errPage.tsx
export const common =
  "break-words text-slate-900 text-sm overflow-x-hidden min-h-svh";
export const container = "w-full 2xl:max-w-screen-2xl mx-auto px-2 lg:px-4";

// page
export const pageGapY = "space-y-6";
export const pageTitle = "text-2xl font-bold";
export const titleAndBtn = "flex items-center justify-between flex-wrap gap-2";

// form
export const formGapY = "space-y-5";
export const formFieldGapY = "space-y-2";
// w-fit: labelが横一杯に広がり、空白をクリック時にinputにフォーカスが当たるのを防ぐため
export const label = "w-fit";

// input
export const inputBox = "border rounded p-2";
export const focus = "focus:outline focus:outline-2 focus:outline-blue-500/50";
export const placeholder = "placeholder:text-sm placeholder:text-slate-400";
export const hover = "hover:bg-gray-100";
export const textInput = `${inputBox} block w-full ${focus} ${placeholder}`;
export const textArea = `${inputBox} block w-full min-h-32 ${focus} ${placeholder}`;
export const select = `${inputBox} cursor-pointer w-full block ${focus}`;
export const checkBox = "cursor-pointer";
export const fieldErr = "text-red-500 text-xs";
export const dateInput = `block ${inputBox} ${focus}`;
export const pageTitleInput = `${pageTitle} block w-full rounded placeholder:text-slate-900/20 ${focus}`;

export const msgBlue = "border-blue-100 bg-blue-50 text-blue-500";
export const msgRed = "border-red-100 bg-red-50 text-red-500";

// ul
export const ulGapY = "space-y-1";

// btn
export const btn =
  "py-1.5 px-4 rounded cursor-pointer disabled:text-neutral-500 disabled:bg-neutral-200";
export const btnBlue = "text-white bg-blue-600 hover:bg-blue-700";
export const btnOutlineRed =
  "text-red-500 border border-red-500 hover:bg-red-50";
export const btnOutlineBlue =
  "text-blue-500 border border-blue-500 hover:bg-blue-50";
export const btnTextOnly = "text-slate-500";
export const msgLikeBtn =
  "text-start px-2 py-4 border rounded text-blue-500 border-blue-100 bg-blue-50 block hover:bg-blue-100";

// suggest
export const suggestBox =
  "absolute z-10 border rounded top-full left-0 w-full bg-white shadow max-h-96 overflow-y-auto py-1";
export const suggestItem = `px-3 py-2 cursor-pointer ${hover}`;


// link
export const linkUnderline = "underline underline-offset-2";
export const animalLink = `font-medium border-b border-slate-300`;
export const pairLink = animalLink;

// animalPage
export const fieldGapY = "space-y-2";

// animalInfo, pairInfo
export const infoBox = `border rounded p-2 min-h-9`;

// sign
export const sign =
  "flex flex-col items-center justify-center gap-y-6 mx-auto pt-12 px-2 max-w-80";
