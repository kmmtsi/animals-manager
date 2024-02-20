import { Item } from "./ComboBox";
import { Chip } from "../../generalUI/Chip";
import { setSuggestItemsWrapper } from "./utils";
import { NameAndSex } from "../../animalsList/NameAndSex";

export const SelectedItems = ({
  regex,
  originalItems,
  selectedItems,
  setSelectedItems,
  setSuggestItems,
  className = "",
  ngItems,
  maxSelect,
}: {
  regex: RegExp;
  originalItems: Item[];
  selectedItems: Item[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setSuggestItems: React.Dispatch<React.SetStateAction<Item[]>>;
  className?: string;
  ngItems: Item[];
  maxSelect: number;
}) => {
  return (
    <>
      <ul className={`flex flex-wrap gap-1 ${className}`}>
        {selectedItems.map((selectedItem, i) => (
          <li key={i}>
            <Chip
              onDelete={() => {
                // 選択されたアイテムと同名のアイテムをselectedItemsから除外
                const newSelectedItems = selectedItems.filter(
                  (item) => item.name !== selectedItem.name
                );
                setSelectedItems(newSelectedItems);
                // 削除に伴い、サジェストを更新
                setSuggestItemsWrapper(
                  regex,
                  newSelectedItems,
                  originalItems,
                  ngItems,
                  maxSelect,
                  setSuggestItems
                );
              }}
            >
              <NameAndSex name={selectedItem.name} sex={selectedItem.sex} />
            </Chip>
          </li>
        ))}
      </ul>
    </>
  );
};
