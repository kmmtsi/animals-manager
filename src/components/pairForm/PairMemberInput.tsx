import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { findAnimalByName } from "../../utils/animal/utils";
import {
  MiniAnimal,
  maxAnimalName,
  maxChildren,
  maxPairedAnimals,
} from "../../utils/common/definitions";
import { formField, suggestBox, suggestItem, textInput } from "../../utils/css";
import { ClickableIcon } from "../generalUI/ClickableIcon";
import { NameAndSex } from "../generalUI/NameAndSex";

export const PairMemberInput = ({
  field,
  members,
  setMembers,
  suggestableAnimals,
}: {
  field: "pairedAnimals" | "children";
  members: MiniAnimal[];
  setMembers: Dispatch<SetStateAction<MiniAnimal[]>>;
  suggestableAnimals: MiniAnimal[];
}) => {
  const label = field === "pairedAnimals" ? "ペアリングする動物" : "子";
  const maxSelect = field === "pairedAnimals" ? maxPairedAnimals : maxChildren;

  const [inputText, setInputText] = useState<string>("");
  const [isSuggestOpen, setIsSuggestOpen] = useState<boolean>(false);

  const handleInputEnter = () => {
    if (inputText === "") return;
    const miniAnimal = findAnimalByName(inputText, suggestableAnimals);
    if (miniAnimal) {
      const newMembers = [...members, miniAnimal];
      setMembers(newMembers);
      setInputText("");
    }
  };

  const handleSuggestClick = (miniAnimal: MiniAnimal) => {
    setMembers([...members, miniAnimal]);
    setInputText("");
  };

  const handleXClick = (miniAnimal: MiniAnimal) => () => {
    // remove
    const newMembers = members.filter((animal) => animal.id !== miniAnimal.id);
    setMembers(newMembers);
    setIsSuggestOpen(false);
  };

  const filteredAnimals = suggestableAnimals.filter((animal) =>
    animal.name.includes(inputText)
  );

  return (
    <div className={formField}>
      {/* ラベル */}
      <div>{label}</div>
      {/* 選択済み ＋ input */}
      <div className="border rounded flex gap-2 items-center">
        {/* 選択された動物 */}
        {members.length > 0 && (
          <div className="flex gap-2 p-1">
            {members.map((miniAnimal, i) => (
              <div
                key={i}
                className="flex gap-x-1 items-center w-fit px-3 py-1 rounded-full bg-slate-200"
              >
                <NameAndSex animal={miniAnimal} />
                <ClickableIcon
                  icon={faClose}
                  onClick={handleXClick(miniAnimal)}
                />
              </div>
            ))}
          </div>
        )}
        {/* 入力関連 */}
        {members.length < maxSelect && (
          /* input + サジェスト */
          <div className="relative w-full">
            {/* input */}
            <input
              value={inputText}
              maxLength={maxAnimalName}
              className={`${textInput} border-0`}
              placeholder="動物を検索して追加または新規追加"
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputEnter();
                }
              }}
              onFocus={() => setIsSuggestOpen(true)}
              onBlur={() => setIsSuggestOpen(false)}
            />
            {/* サジェスチョン */}
            {isSuggestOpen && (
              <div role="listbox" className={suggestBox}>
                <div className="text-xs text-slate-500 px-3">
                  {filteredAnimals.length > 0 ? "候補" : "動物が見つかりません"}
                </div>
                {filteredAnimals.map((miniAnimal) => (
                  <div
                    key={miniAnimal.id}
                    role="option"
                    className={suggestItem}
                    onPointerDown={() => handleSuggestClick(miniAnimal)}
                  >
                    <NameAndSex animal={miniAnimal} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
