import { render, screen } from "@testing-library/react";
import { EmailInput } from "./EmailInput";

test("メールの入力が必須", () => {
  // Arrange
  render(<EmailInput />);
  const emailInput = screen.getByLabelText("Email");
  // Assert
  expect(emailInput).toHaveAttribute("required");
});
