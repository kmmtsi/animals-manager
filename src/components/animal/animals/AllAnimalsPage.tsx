import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchAnimals } from "../../../utils/animal/animalUtils";
import { NewMsg } from "../../generalUI/NewMsg";
import { AllItemsPage } from "../../generalUI/animalAndBreeding/items/AllItemsPage";

export const AllAnimalsPage = () => {
  const user = useOutletContext<User>();

  // ソートの準備
  // const [sortMethod, setSortMethod] = useState<SortMethod>({
  //   target: "createdAt",
  //   order: "desc",
  // });

  const { allAnimals, animalsErr } = useFetchAnimals(user.uid);

  if (allAnimals) {
    // ソートされたanimalsを取得
    // const sortedAnimals = getSortedAnimals(allAnimals, sortMethod);

    return <AllItemsPage type="animals" allItems={allAnimals} />;
  }

  if (animalsErr) {
    return <NewMsg role="err">{animalsErr.message}</NewMsg>;
  }
};
