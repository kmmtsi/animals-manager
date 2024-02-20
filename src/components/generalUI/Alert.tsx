import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const Alert = ({
  role,
  children,
}: {
  role: "success" | "err";
  children: React.ReactNode;
}) => {
  let customCls: string;
  let icon;

  switch (role) {
    case "success":
      icon = faCircleCheck;
      customCls = "border-blue-100 bg-blue-50 text-blue-500";
      break;
    case "err":
      icon = faTriangleExclamation;
      customCls = "border-red-100 bg-red-50 text-red-500";
      break;
  }

  // role="alert"：要素が動的に更新されたことをユーザーに通知するために使用する（https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/alert_role）
  // propsで受け取るalertとは別の意味で使用していることに注意
  return (
    <div
      role="alert"
      className={`flex gap-x-3 items-center text-sm p-4 border rounded ${customCls}`}
    >
      <FontAwesomeIcon icon={icon} />
      {/* divで囲むことでchildrenに対するflexの影響を抑制 */}
      <div>{children}</div>
    </div>
  );
};
