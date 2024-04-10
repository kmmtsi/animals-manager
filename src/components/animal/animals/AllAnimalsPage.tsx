import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { Msg } from "../../generalUI/Msg";
import { AllItemsPage } from "../../generalUI/animalAndBreeding/items/AllItemsPage";
import { Animals } from "./Animals";

export const AllAnimalsPage = () => {
  const authUser = useOutletContext<User>();

  const { allAnimals, animalsErr } = useFetchAnimals(authUser.uid);

  if (allAnimals) {
    return (
      <AllItemsPage type="animals">
        <Animals animals={allAnimals} />
      </AllItemsPage>
    );
  }

  if (animalsErr) {
    return <Msg role="err">{animalsErr.message}</Msg>;
  }
};

// ソートの準備
// const [sortMethod, setSortMethod] = useState<SortMethod>({
//   target: "createdAt",
//   order: "desc",
// });

// ソートされたanimalsを取得
// const sortedAnimals = getSortedAnimals(allAnimals, sortMethod);
