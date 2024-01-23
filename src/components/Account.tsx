import { PageTitle } from "./generalUI/PageTitle";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Btn } from "./elements/Btn";

export const Account: React.FC = () => {
  // const fetcher = async () => {

  // }

  return (
    <>
      <PageTitle tag="h1">アカウント</PageTitle>
      <div className="grid gap-y-2">
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
        <div>
          <h2>メールアドレス</h2>
        </div>
      </div>
    </>
  );
};
