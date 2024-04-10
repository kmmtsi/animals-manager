import { useEffect, useState } from "react";
import {
  Animal,
  Breeding,
  MiniAnimal,
} from "../../../utils/common/definitions";
import { AnimalCreateDemo } from "../../animal/animalCreate/AnimalCreateDemo";
import { AnimalDemo } from "../../animal/animalPage/AnimalDemo";
import { AnimalsDemo } from "../../animal/animals/AnimalsDemo";
import { BreedingCreateDemo } from "../../breeding/breedingCreate/BreedingCreateDemo";
import { BreedingDemo } from "../../breeding/breedingPage/BreedingDemo";
import { BreedingsDemo } from "../../breeding/breedings/BreedingsDemo";
import { TryMeBtns } from "./TryMeBtns";
import { TryMeWindow } from "./TryMeWindow";
import { getDemoAnimals } from "./tryMeUtils/demoAnimals";
import { getDemoBreedings } from "./tryMeUtils/demoBreedings";
import { DemoWindow, demoWindows } from "./tryMeUtils/tryMeUtils";

export const TryMe = () => {
  const [currentWindow, setCurrentWindow] =
    useState<DemoWindow>("createAnimal");

  const [allAnimals, setAllAnimals] = useState<Animal[]>(getDemoAnimals());
  const [allBreedings, setAllBreedings] =
    useState<Breeding[]>(getDemoBreedings);

  const [currentAnimal, setCurrentAnimal] = useState<Animal>(allAnimals[0]);
  const [currentBreeding, setCurrentBreeding] = useState<Breeding>(
    allBreedings[0]
  );

  const [name, setName] = useState("");
  const [parents, setParents] = useState<MiniAnimal[]>([]);
  const [children, setChildren] = useState<MiniAnimal[]>([]);

  const [isTimerActive, setIsTimerActive] = useState(true);

  const stopTimer = () => setIsTimerActive(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isTimerActive && name === "") {
      // timerがアクティブになるたびにリセット
      intervalId = setInterval(() => {
        setCurrentWindow((prevWindow) => {
          const prevIndex = demoWindows.indexOf(prevWindow);
          const nextIndex = (prevIndex + 1) % demoWindows.length;
          return demoWindows[nextIndex];
        });
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive, name]);

  return (
    <div className="w-full max-w-screen-sm">
      {/* ボタン */}
      <TryMeBtns
        currentWindow={currentWindow}
        setCurrentWindow={setCurrentWindow}
        stopTimer={stopTimer}
      />
      {/* 実際のコンポーネント */}
      <div className="rounded-lg p-4 h-[600px] overflow-y-auto border shadow-xl bg-white">
        {/* createAnimal */}
        <TryMeWindow
          window="createAnimal"
          currentWindow={currentWindow}
          stopTimer={stopTimer}
        >
          <AnimalCreateDemo
            name={name}
            setName={setName}
            setCurrentWindow={setCurrentWindow}
            setAllAnimals={setAllAnimals}
          />
        </TryMeWindow>
        {/* allAnimals */}
        <TryMeWindow
          window="allAnimals"
          currentWindow={currentWindow}
          stopTimer={stopTimer}
        >
          <AnimalsDemo
            allAnimals={allAnimals}
            setCurrentAnimal={setCurrentAnimal}
            setCurrentWindow={setCurrentWindow}
          />
        </TryMeWindow>
        {/* animalPage */}
        <TryMeWindow
          window="animalPage"
          currentWindow={currentWindow}
          stopTimer={stopTimer}
        >
          <AnimalDemo
            currentAnimal={currentAnimal}
            allAnimals={allAnimals}
            allBreedings={allBreedings}
            setCurrentAnimal={setCurrentAnimal}
            setCurrentBreeding={setCurrentBreeding}
            setAllAnimals={setAllAnimals}
            setAllBreedings={setAllBreedings}
            setParents={setParents}
            setChildren={setChildren}
            setCurrentWindow={setCurrentWindow}
          />
        </TryMeWindow>
        {/* createBreeding */}
        <TryMeWindow
          window="createBreeding"
          currentWindow={currentWindow}
          stopTimer={stopTimer}
        >
          <BreedingCreateDemo
            allAnimals={allAnimals}
            parents={parents}
            children={children}
            allBreedings={allBreedings}
            setParents={setParents}
            setChildren={setChildren}
            setAllAnimals={setAllAnimals}
            setAllBreedings={setAllBreedings}
            setCurrentWindow={setCurrentWindow}
          />
        </TryMeWindow>
        {/* allBreedings */}
        <TryMeWindow
          window="allBreedings"
          currentWindow={currentWindow}
          stopTimer={stopTimer}
        >
          <BreedingsDemo
            allBreedings={allBreedings}
            setCurrentBreeding={setCurrentBreeding}
            setCurrentWindow={setCurrentWindow}
          />
        </TryMeWindow>
        {/* breedingPage */}
        <TryMeWindow
          window="breedingPage"
          currentWindow={currentWindow}
          stopTimer={stopTimer}
        >
          <BreedingDemo
            breeding={currentBreeding}
            allAnimals={allAnimals}
            allBreedings={allBreedings}
            setAllAnimals={setAllAnimals}
            setAllBreedings={setAllBreedings}
            setCurrentBreeding={setCurrentBreeding}
            setCurrentAnimal={setCurrentAnimal}
            setCurrentWindow={setCurrentWindow}
          />
        </TryMeWindow>
      </div>
    </div>
  );
};

{
  /* <div className="absolute left-0 bottom-full pl-4">
          <img src="src\assets\cat3.png" className="w-8 sm:w-20" />
        </div> */
}
