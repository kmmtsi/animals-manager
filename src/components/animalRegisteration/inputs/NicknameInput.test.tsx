import { render, screen } from "@testing-library/react";
import { NicknameInput } from "./NicknameInput"

test("最大文字数30文字", () => {
  render(<NicknameInput />);
  const input = screen.getByLabelText("ニックネーム");
  expect(input).toHaveAttribute("maxlength", "30");
});
