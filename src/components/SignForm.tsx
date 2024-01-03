import React from "react";
import { Btn } from "./Btn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { clsInput, clsLabel, clsErrMsg } from "./AddAnimal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { errMsgs } from "../util/errorMessages";
import { useState } from "react";

type Props = {
  onSubmit: (data: LoginSchema) => void;
  isSignIn: boolean;
};

/* バリデーション */
const login = z.object({
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
      { message: errMsgs.invalidEmail }
    ),
  password: z
    .string({ required_error: errMsgs.required })
    .min(6, { message: errMsgs.weakPassword }),
});

export type LoginSchema = z.infer<typeof login>;

export const SignForm: React.FC<Props> = ({ onSubmit, isSignIn }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(login) });

  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
          {/* パスワード表示/非表示切り替え */}
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
      {/* TODO: 押下時にpassがtype=textのとき、パスワード保存サジェストでない？ */}
      <Btn type="submit">{isSignIn ? "ログイン" : "新規登録"}</Btn>
    </form>
  );
};
