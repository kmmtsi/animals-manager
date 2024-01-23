import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";

const mockFn = vi.fn();

test("パスワードの入力が必須", () => {
  // Arrange
  render(
    <PasswordInput
      password=""
      setPassword={mockFn}
      autoComplete="current-password"
    />
  );
  const passwordInput = screen.getByLabelText("Password");
  // Assert
  expect(passwordInput).toHaveAttribute("required");
});

test("「パスワードを表示する」チェックボックスまたはラベルをクリックするとパスワードの表示/非表示がトグルする", async () => {
  // Arrange
  render(
    <PasswordInput
      password=""
      setPassword={mockFn}
      autoComplete="current-password"
    />
  );
  const passwordInput = screen.getByLabelText("Password");
  // labelを使用することで、labelとinputの紐づきを暗黙的に確認できる
  const showPasswordCheckbox = screen.getByLabelText("パスワードを表示する");
  // Act & Assertion
  const user = userEvent.setup();
  await user.click(showPasswordCheckbox); // クリック
  expect(passwordInput).toHaveAttribute("type", "text");
  await user.click(showPasswordCheckbox); // クリック
  expect(passwordInput).toHaveAttribute("type", "password");
});
