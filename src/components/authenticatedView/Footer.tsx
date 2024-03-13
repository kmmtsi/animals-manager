import { container } from "../../utils/css";

export const Footer = () => {
  return (
    <footer className="bg-slate-50">
      <div className={`py-6 ${container}`}>
        <div className="text-center text-xs">© 2023 Animals Manager</div>
      </div>
    </footer>
  );
};
