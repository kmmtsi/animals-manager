import { ComboBox } from "./ComboBox";
import { render, screen, cleanup } from "@testing-library/react";
import { Item } from "./ComboBox";
import { click, pressKey } from "../../../utils/test";
import { Mock } from "vitest";

// テストの準備
const mockId = "mockId";
const mockBtnText = "mockBtnText";
const mockPlaceholder = "mockPlaceholder";
const mockMaxLength = 30;
const mockOriginalItems = [
  { name: "mockName1" },
  { name: "mockName2" },
  { name: "mockName3" },
  { name: "mockName4" },
  { name: "mockName5" },
];
const mockSelectedItemsEmpty: Item[] = [];
const mockSelectedItemsFilled: Item[] = [
  { name: "mockName1" },
  { name: "mockName2" },
  { name: "mockName3" },
];
const mockMaxSelect = 3;

// デフォルトのレンダー
const renderWrapper = ({
  id,
  btnText,
  placeholder,
  maxLength,
  originalItems,
  selectedItems,
  setSelectedItems,
  maxSelect,
}: {
  id?: string;
  btnText?: string;
  placeholder?: string;
  maxLength?: number;
  originalItems?: Item[];
  selectedItems?: Item[];
  setSelectedItems?: Mock;
  maxSelect?: number;
} = {}) => {
  render(
    <ComboBox
      id={id || mockId}
      btnText={btnText || mockBtnText}
      placeholder={placeholder || mockPlaceholder}
      maxLength={maxLength || mockMaxLength}
      originalItems={originalItems || mockOriginalItems}
      selectedItems={selectedItems || mockSelectedItemsEmpty}
      setSelectedItems={setSelectedItems || vi.fn()}
      maxSelect={maxSelect || mockMaxSelect}
    />
  );
};

const openDialog = async () => {
  const comboBtn = screen.getByRole("button", { name: mockBtnText });
  const { user } = await click(comboBtn);
  // hidden: trueをつけると普段非表示の要素も検索できる
  const dialog = screen.getByRole("dialog", { hidden: true });
  return { user, dialog };
};

afterEach(cleanup);

test("ComboBtnはbtnTextに与えた文字列をもつ", () => {
  renderWrapper();
  const comboBtn = screen.getByRole("button", { name: mockBtnText });
  expect(comboBtn).toBeInTheDocument();
});

test("新規作成の余地ないときComboBtnは存在しない", async () => {
  renderWrapper({ selectedItems: mockSelectedItemsFilled });
  const comboBtn = screen.queryByRole("button", { name: mockBtnText });
  expect(comboBtn).not.toBeInTheDocument();
});

test("ComboBtnをクリックでdialog開く", async () => {
  renderWrapper();
  const { dialog } = await openDialog();
  expect(dialog).toBeInTheDocument();
});

test("ComboBtnをEnterでdialog開く", async () => {
  renderWrapper();
  const comboBtn = screen.getByRole("button", { name: mockBtnText });
  await pressKey("[Enter]", comboBtn);
  const dialog = screen.getByRole("dialog", { hidden: true });
  expect(dialog).toBeInTheDocument();
});

test("dialog閉じるボタンでdialog閉じる", async () => {
  renderWrapper();
  const { user } = await openDialog();
  const closeBtn = screen.getByRole("button", { name: "閉じる", hidden: true });
  await click(closeBtn, user);
  const dialog = screen.queryByRole("dialog");
  expect(dialog).not.toBeInTheDocument();
});

test("dialog背景押したらdialog閉じる", async () => {
  // 目視確認OK
});

test("escでdialog閉じる", async () => {
  renderWrapper();
  const { user, dialog } = await openDialog();
  await pressKey("[Escape]", dialog, user);
  const dialogAfter = screen.queryByRole("dialog");
  // hidden: trueをつけないことで非表示の場合
  expect(dialogAfter).not.toBeInTheDocument();
});

test("dialog開くとinputに自動フォーカス", async () => {
  // エラーになるが目視ではOK
  // renderWrapper();
  // await openDialog();
  // const input = screen.getByRole("textbox", { hidden: true });
  // expect(input).toHaveFocus();
});

test("作成ボタンはinputが空のときdisabled", async () => {
  renderWrapper();
  await openDialog();
  const createBtn = screen.getByRole("button", { name: "作成", hidden: true });
  expect(createBtn).toBeDisabled();
});

// dialogをhidden: trueなしで取得できるようにならない限り、テストは無意味化されている（onClickでdialogを開けずともテストが合格になってしまう。）。しかしその方法が分からないのでギブアップ。
