import { useForm } from "react-hook-form";
import { db } from "../util/firebase";
import { doc, collection, addDoc, setDoc } from "firebase/firestore";
import { PageTitle } from "./PageTitle";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Btn } from "./Btn";
import { errMsgs } from "../util/errorMessages";

const animal = z.object({
  id: z
    .string({ required_error: errMsgs.required })
    .min(1, { message: errMsgs.required })
    .max(20, { message: errMsgs.tooLong }),
  nickname: z.string().max(20, { message: errMsgs.tooLong }),
  // select
  animalType: z.string().max(20, { message: errMsgs.tooLong }),
  sex: z.string().max(20, { message: errMsgs.tooLong }),
  mother: z.string().max(20, { message: errMsgs.tooLong }),
  father: z.string().max(20, { message: errMsgs.tooLong }),
});

type AnimalSchema = z.infer<typeof animal>;

export const clsInput = "border rounded px-2 py-2 w-full";
export const clsLabel = "block text-sm mb-1 pl-1";
export const clsErrMsg = "text-sm text-red-500";

export const AddAnimal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnimalSchema>({ resolver: zodResolver(animal) });

  const addDB = async (data: AnimalSchema) => {
    const docRef = await addDoc(collection(db, "animals"), data);
  };

  return (
    <>
      <PageTitle tag="h1">新規追加</PageTitle>
      <form onSubmit={handleSubmit(addDB)}>
        <fieldset className="">
          <legend className="font-bold mb-4">個体について</legend>
          <div className="grid grid-cols-12 gap-4">
            {/* ID */}
            <div className="col-span-12">
              <label htmlFor="id" className={clsLabel}>
                *ID（必須）
              </label>
              <input
                id="id"
                placeholder="ID"
                className={clsInput}
                {...register("id")}
              />
              <p className={clsErrMsg}>{errors["id"]?.message}</p>
            </div>
            {/* ニックネーム */}
            <div className="col-span-12">
              <label htmlFor="nickname" className={clsLabel}>
                ニックネーム
              </label>
              <input
                id="nickname"
                placeholder="Nickname"
                className={clsInput}
                {...register("nickname")}
              />
              <p className={clsErrMsg}>{errors["nickname"]?.message}</p>
            </div>
            {/* 動物の種類 */}
            <div className="col-span-12">
              <label htmlFor="animal-type" className={clsLabel}>
                動物の種類
              </label>
              <input
                id="animalType"
                placeholder="鳩"
                className={clsInput}
                {...register("animalType")}
              />
              <p className={clsErrMsg}>{errors["animalType"]?.message}</p>
            </div>
            {/* 性別 */}
            <div className="col-span-12">
              <label htmlFor="sex" className={clsLabel}>
                性別
              </label>
              <select {...register("sex")} id="sex" className={clsInput}>
                <option value="">選択してください</option>
                <option value="オス">オス</option>
                <option value="恐らくオス">恐らくオス</option>
                <option value="メス">メス</option>
                <option value="恐らくメス">恐らくメス</option>
                <option value="不明">不明</option>
                <option value="どちらでもない">どちらでもない</option>
              </select>
              <p className={clsErrMsg}>{errors["sex"]?.message}</p>
            </div>
            {/* 母親 */}
            <div className="col-span-12">
              <label htmlFor="mother" className={clsLabel}>
                母親
              </label>
              <input
                id="mother"
                placeholder="ID"
                className={clsInput}
                {...register("mother")}
              />
              <p className={clsErrMsg}>{errors["mother"]?.message}</p>
            </div>
            {/* 父親 */}
            <div className="col-span-12">
              <label htmlFor="father" className={clsLabel}>
                父親
              </label>
              <input
                id="father"
                placeholder="ID"
                className={clsInput}
                {...register("father")}
              />
              <p className={clsErrMsg}>{errors["father"]?.message}</p>
            </div>
          </div>
        </fieldset>
        <Btn type="submit">新規追加</Btn>
      </form>
      <div></div>
    </>
  );
};
