import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { CheckboxGroup } from "../../generalUI/CheckboxGroup";
// import { useState } from "react";

export const NotMyMotherInput = () => {
  // const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <CheckboxGroup>
      <Input
        id="notMyMother"
        //checked={isChecked}
        type="checkbox"
        value="true"
        // onChange={(e) => setIsChecked(e.target.checked)}
      />
      <Label htmlFor="notMyMother">母親をリストに登録しない</Label>
    </CheckboxGroup>
  );
};
