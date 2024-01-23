import { render, screen } from "@testing-library/react";
import { EmailInput } from "./EmailInput";

const mockFn = vi.fn();

test("メールの入力が必須", () => {
  // Arrange
  render(<EmailInput email="" setEmail={mockFn} />);
  const emailInput = screen.getByLabelText("Email");
  // Assert
  expect(emailInput).toHaveAttribute("required");
});
