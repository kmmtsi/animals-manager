import { render, screen } from "@testing-library/react";
import { FatherInput } from "./FatherInput"

test("", () => {
  render(<FatherInput />);
  const input = screen.getByLabelText("父親");
  expect(input).toHaveAttribute("maxlength", "30");
});
