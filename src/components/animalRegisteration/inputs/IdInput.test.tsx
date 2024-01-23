import { render, screen } from "@testing-library/react";
import { IdInput } from "./IdInput";

test("", () => {
  render(<IdInput />);
  const input = screen.getByLabelText("ID");
  expect(input).toHaveAttribute("required");
  expect(input).toHaveAttribute("maxlength", "30");
});
