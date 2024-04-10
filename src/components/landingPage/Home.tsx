import { Hero } from "./sections/Hero";
import { Price } from "./sections/Price";
import { WhatYouCanDo } from "./sections/whatYouCanDo/WhatYouCanDo";

export const Home = () => {
  return (
    <>
      <Hero />
      <Price />
      <WhatYouCanDo />
    </>
  );
};
