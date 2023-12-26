import { PageTitle } from "./PageTitle";
import { signOut } from "firebase/auth";
import { auth } from "../util/firebase";
import { Btn } from "./Btn";

export const Account: React.FC = () => {
  return (
    <>
      <PageTitle tag="h1">アカウント</PageTitle>
      <div className="flex flex-col gap-y-2">
        <Btn
          onClick={async () => {
            try {
              await signOut(auth);
            } catch (error) {
              alert("ログアウトに失敗しました");
            }
          }}
          className="w-fit"
        >
          ログアウト
        </Btn>
        <p className="text-sm">
          現在ログイン中のアカウントからログアウトします
        </p>
      </div>
    </>
  );
};
