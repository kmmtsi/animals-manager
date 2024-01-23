import { render, screen } from "@testing-library/react";
import { NameInput } from "./NameInput";

test("", () => {
  render(<NameInput />);
  const input = screen.getByLabelText("名前");
  expect(input).toHaveAttribute("required");
  expect(input).toHaveAttribute("maxlength", "30");
});
