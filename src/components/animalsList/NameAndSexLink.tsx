import { NameAndSex } from "./NameAndSex";
import { Link } from "react-router-dom";
import { Sex } from "../../utils/animal/definitions";

export const NameAndSexLink = ({
  id,
  name,
  sex,
}: {
  id: string;
  name: string;
  sex: Sex;
}) => {
  return (
    <Link
      to={`/${id}`}
      className="underline underline-offset-2 decoration-1 decoration-slate-400"
    >
      <NameAndSex name={name} sex={sex} />
    </Link>
  );
};
