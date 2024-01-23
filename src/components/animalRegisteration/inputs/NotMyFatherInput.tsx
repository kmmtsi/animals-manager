import { Input } from "../../elements/Input";
import { Label } from "../../elements/Label";
import { CheckboxGroup } from "../../generalUI/CheckboxGroup";
// import { useState } from "react";

export const NotMyFatherInput = () => {
  // const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <CheckboxGroup>
      <Input
        id="notMyFather"
        // checked={isChecked}
        type="checkbox"
        value="true"
        // onChange={(e) => setIsChecked(e.target.checked)}
      />
      <Label htmlFor="notMyFather">父親をリストに登録しない</Label>
    </CheckboxGroup>
  );
};
