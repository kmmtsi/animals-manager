import { faFishFins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Logo = ({
  options,
}: {
  options?: {
    linkTo?: string;
  };
}) => {
  const linkTo = options?.linkTo;

  const inner = (
    <>
      <FontAwesomeIcon icon={faFishFins} className="text-blue-500" />
      <span className="font-medium">Animals manager</span>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="flex gap-x-1 items-center">
        {inner}
      </Link>
    );
  } else {
    return <div className="flex gap-x-1 items-center">{inner}</div>;
  }
};
