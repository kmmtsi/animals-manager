import { Link } from "react-router-dom";
import { Container } from "../generalUI/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFishFins } from "@fortawesome/free-solid-svg-icons";

export const Header = () => {
  return (
    <header className="border-b h-16 sticky flex items-center">
      <Container className="flex items-center justify-between">
        <div>
          <Link to="/" className="flex gap-x-1 items-center">
            <FontAwesomeIcon icon={faFishFins} className="text-blue-500" />
            <span className="font-medium">Animals manager</span>
          </Link>
        </div>
      </Container>
    </header>
  );
};
