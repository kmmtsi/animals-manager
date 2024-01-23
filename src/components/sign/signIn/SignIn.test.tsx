import { render, screen } from "@testing-library/react";
import { SignIn } from "./SignIn";

test("h2「ログイン」と「ログイン」ボタンが表示される", () => {
  // Arrange
  render(<SignIn />);
  // Act
  // Assert
  expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "ログイン" })).toBeInTheDocument();
});

// test("「ログイン」クリックでloginUser関数が実行される", async () => {
//   // Arrange
//   render(<SignIn />);
//   const loginBtn = screen.getByRole("button", { name: "ログイン" });
//   // Act
//   const user = userEvent.setup();
//   await user.click(loginBtn);
//   // Assertion
// });
