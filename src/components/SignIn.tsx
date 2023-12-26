import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../util/firebase";
import { Btn } from "./Btn";
import { Container } from "./Container";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clsInput, clsLabel, clsErrMsg } from "./AddAnimal";
import { errMsgs } from "../util/errorMessages";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const login = z.object({
  // TODO: メールアドレスの事前バリデーション
  email: z.string().email({ message: errMsgs.invalidEmail }),
  // TODO: パスワードの事前バリデーション
  password: z
    .string({ required_error: errMsgs.required })
    .min(5, { message: errMsgs.tooShort }),
});

type LoginSchema = z.infer<typeof login>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(login) });

  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="px-4 sm:px-12 py-4 sm:py-20 rounded-xl bg-white">
        <h1 className="text-lg mb-4 font-bold">Animal managerにログイン</h1>
        <form
          onSubmit={handleSubmit(async (data: LoginSchema) => {
            try {
              // console.log(data);
              await signInWithEmailAndPassword(auth, data.email, data.password);
              // ログイン成功
            } catch (err) {
              // ログイン失敗
              alert(errMsgs.loginFailed);
            }
          })}
          className="grid gap-4"
        >
          {/* Email */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="email" className={clsLabel}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              className={clsInput}
              {...register("email")}
            />
            <p className={clsErrMsg}>{errors["email"]?.message}</p>
          </div>
          {/* Password */}
          <div className="flex flex-col gap-y-2">
            <label htmlFor="password" className={clsLabel}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordShown ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                className={`${clsInput} pr-8`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setIsPasswordShown((prev) => !prev)}
                className="absolute top-0 right-0 w-8 h-full"
              >
                <FontAwesomeIcon icon={isPasswordShown ? faEye : faEyeSlash} />
              </button>
            </div>
            <p className={clsErrMsg}>{errors["password"]?.message}</p>
          </div>
          <Btn type="submit">ログイン</Btn>
        </form>
      </div>
    </Container>
  );
}
