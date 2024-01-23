import { render, screen } from "@testing-library/react";
import { MotherInput } from "./MotherInput"

test("", () => {
  render(<MotherInput />);
  const input = screen.getByLabelText("母親");
  expect(input).toHaveAttribute("maxlength", "30");
});
