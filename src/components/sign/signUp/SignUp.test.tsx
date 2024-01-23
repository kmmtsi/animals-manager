import { render, screen } from "@testing-library/react";
import { SignUp } from "./SignUp";

test("h2「新規登録」と「新規登録」ボタンが表示される", () => {
  // Arrange
  render(<SignUp />);
  // Act
  // Assert
  expect(screen.getByRole("button", { name: "新規登録" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "新規登録" })).toBeInTheDocument();
});
