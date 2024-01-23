import { Container } from "./Container";

export const Header = () => {
  return (
    <header className="border-b h-16 sticky flex items-center">
      <Container>
        <div>
          <a href="/">Animals manager</a>
        </div>
        <nav>
          <ul>
            <li></li>
          </ul>
        </nav>
      </Container>
    </header>
  );
};
