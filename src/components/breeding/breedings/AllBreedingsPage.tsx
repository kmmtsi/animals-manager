import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useFetchBreedings } from "../../../utils/breeding/breedingUtils";
import { Msg } from "../../generalUI/Msg";
import { AllItemsPage } from "../../generalUI/animalAndBreeding/items/AllItemsPage";
import { Breedings } from "./Breedings";

export const AllBreedingsPage = () => {
  const authUser = useOutletContext<User>();

  const { allBreedings, breedingsErr } = useFetchBreedings(authUser.uid);

  if (allBreedings) {
    return (
      <AllItemsPage type="breedings">
        <Breedings breedings={allBreedings} />
      </AllItemsPage>
    );
  }
  if (breedingsErr) {
    return <Msg role="err">{breedingsErr.message}</Msg>;
  }
};
