import { Container } from "../generalUI/Container";
import { Logo } from "../generalUI/logo/Logo";

export const Header = () => {
  return (
    <header className="border-b h-16 sticky flex items-center">
      <Container className="flex items-center justify-between">
        <Logo isLink={true} />
      </Container>
    </header>
  );
};
