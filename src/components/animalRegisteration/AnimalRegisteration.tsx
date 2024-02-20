import { PageTitle } from "../generalUI/PageTitle";
import { AnimalForm } from "../animalForm/AnimalForm";

export const AnimalRegisteration = () => {
  return (
    <div className="grid gap-y-6">
      <PageTitle tag="h1">新規追加</PageTitle>
      <div className="text-sm text-slate-500">
        <ul className="grid gap-y-1">
          <li>マイリストに動物を登録します</li>
          <li>両親または子どもは、自動で紐づけまたは新規登録されます</li>
        </ul>
      </div>
      <AnimalForm />
    </div>
  );
};
