import { User, signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { btn, btnBlue, pageTitle } from "../../utils/css";
import { useOutletContext } from "react-router-dom";

export const Account = () => {
  const user = useOutletContext<User>();

  const menu = "space-y-1";
  const menuTitle = "text-base";

  return (
    <div className="space-y-6">
      <h1 className={pageTitle}>アカウント</h1>
      <div className="space-y-4">
        {/* ログアウト */}
        <div className={menu}>
          <div className={menuTitle}>ログアウト</div>
          <div>現在ログイン中のアカウントからログアウトします</div>
          <button
            onClick={async () => {
              try {
                await signOut(auth);
              } catch (error) {
                alert("ログアウトに失敗しました");
              }
            }}
            className={`${btn} ${btnBlue} w-fit`}
          >
            ログアウト
          </button>
        </div>
        <div className={menu}>
          <div className={menuTitle}>メールアドレス</div>
          <div>{user.email}</div>
        </div>
      </div>
    </div>
  );
};
