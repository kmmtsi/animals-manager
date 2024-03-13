import { container } from "../../utils/css";
import { Logo } from "../generalUI/logo/Logo";

export const Header = () => {
  return (
    <header className="border-b h-16 sticky flex items-center">
      <div className={`flex items-center justify-between ${container}`}>
        <Logo isLink={true} />
      </div>
    </header>
  );
};
