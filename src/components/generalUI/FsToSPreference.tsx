import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AnimalFsToS,
  BreedingFsToS,
} from "./animalAndBreeding/items/tableView/tableUtils";
import { btn, checkBox, hover } from "../../utils/css";

export const FsToSPreference = <T extends AnimalFsToS | BreedingFsToS>({
  fsToS,
  handleCheckFToS,
}: {
  fsToS: T;
  handleCheckFToS: (field: keyof T) => void;
}) => {
  const [isBoxShown, setIsBoxShown] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        className={`${btn} ${hover}`}
        onClick={() => {
          setIsBoxShown(true);
        }}
      >
        {t("fsToSPreference")}
      </button>
      {isBoxShown && (
        <>
          {/* 背景 */}
          <div className="fixed inset-0" onClick={() => setIsBoxShown(false)} />
          {/* ボックス */}
          <div className="absolute top-full right-0 rounded space-y-0.5 bg-white w-fit border shadow p-2">
            {Object.keys(fsToS).map((fieldName, i) => {
              // 各input
              return (
                <div
                  key={i}
                  className={`flex gap-x-1 rounded px-2 py-1.5 ${hover}`}
                >
                  <input
                    id={fieldName}
                    type="checkbox"
                    className={checkBox}
                    checked={fsToS[fieldName as keyof T] as boolean}
                    onChange={() => handleCheckFToS(fieldName as keyof T)}
                  />
                  <label htmlFor={fieldName} className={`break-keep w-full`}>
                    {t(fieldName)}
                  </label>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
