import { pageGapY, pageTitle } from "../../utils/css";
import { AnimalForm } from "../animalForm/AnimalForm";

export const AnimalCreation = () => {
  return (
    <div className={pageGapY}>
      <h1 className={pageTitle}>動物を作成</h1>
      <AnimalForm />
    </div>
  );
};
