import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { User } from "firebase/auth";
import { useSWRAnimals } from "../../utils/animal/fetch";
import { LoadingIndicator } from "../generalUI/LoadingIndicator";
import { Alert } from "../generalUI/Alert";
import { getAnimalById } from "../../utils/animal/utils";
import { PageTitle } from "../generalUI/PageTitle";
import { AnimalForm } from "../animalForm/AnimalForm";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { TimeChip } from "./TimeChip";

export const Animal = () => {
  const user = useOutletContext<User>();
  const { animalId } = useParams();
  const { data: animals, isLoading, error } = useSWRAnimals(user.uid);
  const animal = getAnimalById(animalId || "", animals || []);

  return (
    <>
      {animal && (
        <div className="grid gap-y-6">
          <PageTitle tag="h1">{animal.name}</PageTitle>
          <div className="flex gap-x-1">
            <TimeChip timestamp={animal.createdAt} text="登録" icon={faClock} />
            <TimeChip
              timestamp={animal.updatedAt}
              text="更新"
              icon={faRotate}
            />
          </div>
          <AnimalForm prevAnimal={animal} />
        </div>
      )}
      {isLoading && <LoadingIndicator />}
      {/* DB読み込みエラー */}
      {error && <Alert role="err">{error.message}</Alert>}
    </>
  );
};
