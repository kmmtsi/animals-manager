import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SignForm } from "./SignForm"
import userEvent from "@testing-library/user-event";

describe("Sign-in/up画面のテスト", async () => {
  // Arrange
  beforeEach(() => {
    // render(<Sign />);
  });

  const mockFn = vi.fn();

  test("初期表示で「ログイン」ボタンと「新規登録はこちら」ボタンが表示される", () => {
    // Arrange
    render(<SignForm onSubmit={mockFn}/>);
    const loginBtn = screen.getByRole("button", { name: "ログイン" });
    const createAccountBtn = screen.getByRole("button", {
      name: "新規登録はこちら",
    });
    // Act
    // Assert
    expect(loginBtn).toBeInTheDocument();
    expect(createAccountBtn).toBeInTheDocument();
  });

  test("「新規登録はこちら」をクリックすると「新規登録」ボタンが表示される", async () => {
    // Arrange
    render(<SignForm />);
    const createAccountBtn = screen.getByRole("button", {
      name: "新規登録はこちら",
    });
    const user = userEvent.setup();
    // Act
    await user.click(createAccountBtn);
    // Assert
    expect(
      screen.getByRole("button", { name: "新規登録" })
    ).toBeInTheDocument();
  });

  /* コピー用ますたー */
  test("", () => {
    // Arrange
    // Act
    // Assert
  });
});
