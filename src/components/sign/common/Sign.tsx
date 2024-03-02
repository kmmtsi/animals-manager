import { SignIn } from "../signIn/SignIn";
import { SignUp } from "../signUp/SignUp";
import { useState } from "react";
import { Container } from "../../generalUI/Container";
import { Logo } from "../../generalUI/logo/Logo";

export const Sign = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="px-4 sm:px-12 py-4 sm:py-20 bg-white lg:border grid gap-y-4">
        <Logo isLink={false} />
        {isSignIn ? <SignIn /> : <SignUp />}
        <div className="border-t" />
        {/* 新規登録, ログイン切り替えボタン */}
        <button
          onClick={() => setIsSignIn((prev) => !prev)}
          className="w-fit text-slate-500 mx-auto"
        >
          {isSignIn ? "新規登録" : "ログイン"}はこちら
        </button>
      </div>
    </Container>
  );
};
