import { Sex, dummyText } from "../../utils/animal/definitions";
import { formatSex } from "../../utils/animal/utils";
import { Td } from "../animalsList/Td";
import { Th } from "../animalsList/Th";
import { PageTitle } from "../generalUI/PageTitle";
import { useState } from "react";
import { Label } from "../generalUI/form/Label";
import { msgBlue, btn, btnBlue, ulSpace, btnOutlineRed } from "../../utils/css";
import { Msg } from "../generalUI/Msg";
import { FormField } from "../generalUI/form/FormField";
import { Input } from "../generalUI/form/Input";
import { Form } from "../generalUI/form/Form";

export const AnimalsImport = () => {
  const [animalsToCreate, setAnimalsToCreate] = useState<
    {
      name: string;
      sex: Sex;
      parents: string[];
      children: string[];
      note: string;
    }[]
  >([]);

  const dummyText =
    "名前,性別,親,子ども,メモ\nB22-6208826,,,,Pattayaからヨハンの元に届いているか確認中（2023/12/25）\nBE17-6129310,Male,,BE23-6113611;BE23-6113612,\nBE18-6227405,Female,,,\nBE21-6167308,Male,,BE23-6113621;BE23-6113622,\nBE21-6167327,Female,,,2023/5/21メールで雌と判明。\nBE21-6167369,Male,,,\nBE22-4208008,Male,,BE23-6113638;BE23-6113769;BE23-6113770,\nBE22-6208788,Female,,,\nBE22-6208800,Prob. male,,,\nBE22-6208801,Female,,,\nBE22-6208806,Female,,BE23-6113637;BE23-6113767;BE23-6113768,from brother Aleksej/daughter caprina\nBE22-6208807,Female,,,\nBE22-6208815,Female,,BE23-6113638;BE23-6113769;BE23-6113770,from int.propere/ daughter Theo\nBE22-6208816,Female,,BE23-6113619;BE23-6113620,\nBE23-6113605,indistinguishable,NL21-1676402;NL21-1193913,,\nBE23-6113606,indistinguishable,NL21-1676402;NL21-1193913,,\nBE23-6113607,indistinguishable,NL21-1700658;BE21-6167373,,\nBE23-6113608,indistinguishable,NL21-1700658;BE21-6167373,,\nBE23-6113609,indistinguishable,NL17-1279476;NL14-1068205,,23_Algarveかも？\nBE23-6113610,indistinguishable,NL17-1279476;NL14-1068205,,";

  const rows = dummyText.split("\n");

  // 1行目を削除
  rows.shift();

  const dummyAnimalsToCreate = rows.map((row) => {
    // 各値
    const values = row.split(",");

    const name = values[0];
    const sex = formatSex(values[1]);
    const parents = values[2].split(";");
    const children = values[3].split(";");
    const note = values[4];

    return {
      name,
      sex,
      parents,
      children,
      note,
    };
  });
  // setAnimalsToCreate(animalsToCreate);

  return (
    <div className="grid gap-y-6">
      <PageTitle tag="h1">インポート</PageTitle>
      <div>CSVファイルから動物のリストをインポートします</div>
      <Msg role="info">
        <div className="font-medium mb-2">CSVファイルの形式について</div>
        <ul className={`list-disc list-inside ${ulSpace}`}>
          <li>各データ内で改行しないでください</li>
          <li>
            親、子どもに複数の値が入る場合はセミコロン ( ; ) で区切ってください
          </li>
          <li>名前が一致する動物は自動的にリンクされます</li>
        </ul>
      </Msg>
      {animalsToCreate.length === 0 ? (
        // animalsToCreateが空の時
        // ボタン
        <FormField>
          <label
            htmlFor="file"
            className={`border w-fit ${btn} ${btnBlue}`}
          >
            CSVファイルを選択
          </label>
          <input
            id="file"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              // onChangeが呼ばれるのはファイルが選択または選択解除された時
              if (!e.target.files) return;
              // ファイルが選択されているとき
              const file = e.target.files[0];

              const reader = new FileReader();

              // ファイルの読み込みが完了した時に実行する処理
              reader.onload = (e) => {
                if (!e.target) throw new Error("ファイルが読み込めません");

                // resultは基本的にstring
                const result = e.target.result;
                if (typeof result !== "string")
                  throw new Error("ファイルが読み込めません");

                // 改行コードを統一
                // \n: Unix
                // \r\n: Windows -> \n
                // \r: 古いMac -> \n
                const formatedText = result.replace(/\r\n|\r/g, "\n");

                // 行ごとの配列に変換（CSVファイルが自動生成する改行文字で1行終わり判定
                const rows = formatedText.split("\n");

                // 1行目を削除
                rows.shift();

                const animalsToCreate = rows.map((row) => {
                  // 各値
                  const values = row.split(",");
                  const name = values[0];
                  const sex = formatSex(values[1]);
                  const parents = values[2].split(";");
                  const children = values[3].split(";");
                  const note = values[4];

                  return {
                    name,
                    sex,
                    parents,
                    children,
                    note,
                  };
                });
                setAnimalsToCreate(animalsToCreate);
              };

              // ファイルの読み込み
              reader.readAsText(file);
            }}
          />
        </FormField>
      ) : (
        // animalsToCreateに1つ以上の要素があるとき
        // overflow-x-autoを付与した要素を外側に配置する
        <div className="overflow-x-auto space-y-4">
          <div className="space-y-2">
            <div>この内容で登録しますか？</div>
            <div className="flex gap-x-3">
              <button type="button" className={`${btn} ${btnBlue}`}>
                実行
              </button>
              <button type="button" className={`${btn} ${btnOutlineRed}`}>
                やり直す
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>名前</Th>
                  <Th>性別</Th>
                  <Th>親</Th>
                  <Th>子ども</Th>
                  <Th>メモ</Th>
                </tr>
              </thead>
              <tbody>
                {dummyAnimalsToCreate.map((animal, i) => {
                  return (
                    <tr key={i}>
                      <Td>{animal.name}</Td>
                      <Td>{animal.sex}</Td>
                      <Td>
                        {animal.parents.map((parent, index) => {
                          return <div key={index}>{parent}</div>;
                        })}
                      </Td>
                      <Td>
                        {animal.children.map((child, index) => {
                          return <div key={index}>{child}</div>;
                        })}
                      </Td>
                      <Td>{animal.note}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
