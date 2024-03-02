import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFishFins } from "@fortawesome/free-solid-svg-icons";

export const Logo = ({ isLink }: { isLink: boolean }) => {
  const inner = (
    <>
      <FontAwesomeIcon icon={faFishFins} className="text-blue-500" />
      <span className="font-medium">Animals manager</span>
    </>
  );

  if (isLink) {
    return (
      <Link to="/" className="flex gap-x-1 items-center">
        {inner}
      </Link>
    );
  } else {
    return <div className="flex gap-x-1 items-center">{inner}</div>;
  }
};
