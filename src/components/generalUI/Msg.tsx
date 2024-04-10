import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { msgBlue, msgRed } from "../../utils/css";
import { ReactNode } from "react";

export const Msg = ({
  role,
  className = "",
  children,
}: {
  role: "success" | "err" | "info";
  className?: string;
  children: ReactNode;
}) => {
  let customCls: string;
  let icon;
  let htmlRole: undefined | string;

  switch (role) {
    case "success":
      htmlRole = "alert";
      icon = faCircleCheck;
      customCls = msgBlue;
      break;
    case "err":
      htmlRole = "alert";
      icon = faTriangleExclamation;
      customCls = msgRed;
      break;
    case "info":
      htmlRole = undefined;
      icon = faCircleInfo;
      customCls = msgBlue;
      break;
  }

  return (
    <div
      role={htmlRole}
      className={`flex gap-x-4 items-start text-sm p-4 border rounded ${customCls} ${className}`}
    >
      <div>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>{children}</div>
    </div>
  );
};
