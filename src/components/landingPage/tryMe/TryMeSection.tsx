import { lpContainer, lpSectionFlex } from "../../../utils/css";
import { TryMe } from "./TryMe";

export const TryMeSection = () => {
  return (
    <section className="py-12 bg-yellow-400">
      <div className={`${lpContainer} ${lpSectionFlex} py-12`}>
        <div
          className={`text-center pb-9 font-serif text-5xl font-semibold text-white`}
        >
          Try it!
        </div>

        <TryMe />
      </div>
    </section>
  );
};

{
  /* イラスト */
}
{
  /* <div className="flex items-center justify-center">
          <img src="src\assets\cat.png" className="max-w-36" />
        </div>
        <div className={`${lpSectionTitle} font-serif`}>Try me!</div>
        <div className={`text-base`}>実際の画面の一部を触ってみてください</div> */
}
