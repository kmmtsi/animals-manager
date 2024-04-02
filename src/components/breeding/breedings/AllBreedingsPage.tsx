import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { NewMsg } from "../../generalUI/NewMsg";
import { AllItemsPage } from "../../generalUI/animalAndBreeding/items/AllItemsPage";

export const AllBreedingsPage = () => {
  const authUser = useOutletContext<User>();

  const { allBreedings, breedingsErr } = useFetchBreedings(authUser.uid);

  if (allBreedings) {
    return <AllItemsPage type="breedings" allItems={allBreedings} />;
  }
  if (breedingsErr) {
    return <NewMsg role="err">{breedingsErr.message}</NewMsg>;
  }
};
