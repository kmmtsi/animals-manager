import { render, screen } from "@testing-library/react";
import { NoteInput } from "./NoteInput"

test("最大文字数500文字", () => {
  render(<NoteInput />);
  const input = screen.getByLabelText("メモ");
  expect(input).toHaveAttribute("maxlength", "500");
});
