import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Animal, Breeding } from "../../../../../utils/common/definitions";
import {
  getPathToAnimalPage,
  getPathToBreedingPage,
} from "../../../../../utils/common/pageUtils";
import { checkBox, hover } from "../../../../../utils/css";
import {
  FsToS,
  RenderData,
  RenderDataBundle,
  animalRenderDataBundle,
  breedingRenderDataBundle,
} from "./tableUtils";

export const Table = <T extends Animal | Breeding>({
  type,
  items,
  checkedItems,
  check,
  checkAll,
  fsToS,
}: {
  type: T extends Animal ? "animals" : "breedings";
  items: T[];
  checkedItems: T[];
  check: (clickedItem: T) => void;
  checkAll: (allItems: T[]) => void;
  fsToS: FsToS<T>;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cell = "px-2 text-start";
  const th = `${cell} py-3 font-normal`;
  const td = `${cell} py-3`;
  const twCheck = "w-10";
  const tableCheckBox = `size-3.5 mx-1 ${checkBox}`;

  const renderDatas: RenderData<T>[] = [];
  const renderDataBundle =
    type === "animals"
      ? (animalRenderDataBundle as RenderDataBundle<T>)
      : (breedingRenderDataBundle as RenderDataBundle<T>);

  Object.keys(fsToS).forEach((field) => {
    if (fsToS[field as keyof FsToS<T>]) {
      renderDatas.push(renderDataBundle[field as keyof FsToS<T>]);
    }
  });

  return (
    <table className="min-w-full">
      {/* ヘッダー */}
      <thead>
        <tr className="border-b bg-gray-100">
          {/* checkbox */}
          <th className={`${th} ${twCheck}`} onClick={() => checkAll(items)}>
            <input
              type="checkbox"
              className={tableCheckBox}
              checked={items.length > 0 && checkedItems.length === items.length}
              readOnly={true} // onChangeを使わない場合必要
            />
          </th>
          {renderDatas.map((data, i) => (
            <th key={i} className={`${th} ${data.css}`}>
              {t(data.field as string)}
            </th>
          ))}
          {/* スペース用ダミー */}
          <th />
        </tr>
      </thead>
      {/* データ中身 */}
      <tbody>
        {items.map((item) => {
          const id = item.id;
          return (
            /* breeding */
            <tr
              data-id={id}
              key={id}
              className={`border-b cursor-pointer ${hover} ${
                checkedItems.includes(item) ? "bg-slate-100" : ""
              }`}
              onClick={() =>
                navigate(
                  type === "animals"
                    ? getPathToAnimalPage(id)
                    : getPathToBreedingPage(id)
                )
              }
            >
              {/* checkbox */}
              <td
                className={`${td} ${twCheck}`}
                onClick={(e) => {
                  check(item);
                  // itemのページに飛ぶのを防ぐ
                  e.stopPropagation();
                }}
              >
                <input
                  type="checkbox"
                  className={tableCheckBox}
                  checked={checkedItems.includes(item)}
                  readOnly={true} // onChangeを使わない場合必要
                />
              </td>
              {renderDatas.map((data, i) => (
                <td key={i} className={`${td} ${data.css}`}>
                  {data.content(item)}
                </td>
              ))}
              {/* スペース用ダミー */}
              <td />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
