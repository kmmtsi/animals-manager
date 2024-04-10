// App.tsx, errPage.tsx
export const common =
  "break-words text-slate-900 text-sm overflow-x-hidden min-h-svh";
export const container = "w-full 2xl:max-w-screen-2xl mx-auto px-2 lg:px-4";

// page
export const pageGapY = "space-y-6";
export const pageTitle = "text-2xl sm:text-3xl font-bold";
export const titleAndBtn = "flex items-center justify-between flex-wrap gap-2";

// form
export const formGapY = "space-y-5";
export const formFieldGapY = "space-y-2";
// w-fit: labelが横一杯に広がり、空白をクリック時にinputにフォーカスが当たるのを防ぐため
export const label = "w-fit";

// input
export const inputBox = "border rounded p-2";
export const focus = "focus:ring-2 ring-inset ring-blue-500/50 outline-none";
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
export const btn = "py-1.5 px-3 rounded cursor-pointer";
export const btnBlue = "text-white bg-blue-500 hover:bg-blue-600";
export const btnOutlineRed =
  "text-red-500 border border-red-500 hover:bg-red-50";
export const btnOutlineBlue =
  "text-blue-500 border border-blue-500 hover:bg-blue-50";
export const btnTextOnly = "text-slate-500";
export const msgLikeBtn =
  "text-start px-2 py-4 border rounded text-blue-500 border-blue-100 bg-blue-50 block w-full hover:bg-blue-100";
// const btnDisabled = "disabled:text-neutral-500 disabled:bg-neutral-200";

// suggest
export const suggestBox =
  "absolute z-10 border rounded top-full left-0 w-full bg-white shadow max-h-96 overflow-y-auto py-1";
export const suggestItem = `px-3 py-2 cursor-pointer ${hover}`;

// link
export const textLink =
  "text-slate-500 underline underline-offset-2 decoration-slate-400";
export const textLinkHover =
  "text-slate-500 hover:underline underline-offset-2 decoration-slate-400";

// animalPage
export const fieldGapY = "space-y-2";

// animalInfo, pairInfo
export const infoBox = `border rounded p-2 min-h-9`;

// lp
export const lpContainer = "container mx-auto px-4";
export const lpSectionTitle = "text-3xl md:text-4xl font-semibold";
export const lpSectionFlex = "flex flex-col gap-8 items-center justify-center";

// z-index
export const zAuthedMain = {
  main: "z-10",
  children: {
    tableColumnConfig: "z-10",
  },
};
export const zSidebarSm = "z-20"; // mainより上
export const zSidebarLg = "z-0"; // mainより下
