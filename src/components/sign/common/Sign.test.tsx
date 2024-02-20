import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sign } from "./Sign";

test("初期表示はログイン画面である", () => {
  render(<Sign />);
  expect(screen.getByRole("heading", { name: "ログイン" })).toBeInTheDocument();
});

test("初期表示の「新規登録はこちら」ボタンをクリックすると、新規登録画面に切り替わり、再度クリックするとログイン画面に戻る", async () => {
  // Arrange
  render(<Sign />);
  const switchBtn = screen.getByRole("button", { name: "新規登録はこちら" });
  // Act & Assert
  const user = userEvent.setup();
  await user.click(switchBtn);
  // Assert
  expect(screen.getByRole("heading", { name: "新規登録" })).toBeInTheDocument();
  await user.click(switchBtn);
  expect(screen.getByRole("heading", { name: "ログイン" })).toBeInTheDocument();
});
