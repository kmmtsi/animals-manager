import {
  faCircleNodes,
  faFolder,
  faPaperPlane,
  faShieldCat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import imgUrl from "../../../../assets/pigeon.png";
import {
  lpContainer,
  lpSectionFlex,
  lpSectionTitle,
  textLink,
} from "../../../../utils/css";
import { BreedingGrid } from "../../../breeding/BreedingGrid";
import { WhatYouCanDoBox } from "./WhatYouCanDoBox";
import { WhatYouCanDoUl } from "./WhatYouCanDoUl";

export const WhatYouCanDo = () => {
  const { t: tLp } = useTranslation("lp");

  return (
    <section className="py-14">
      <div className={`${lpContainer} ${lpSectionFlex}`}>
        <h2 className={lpSectionTitle}>{tLp("features.title")}</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* 動物 */}
          <WhatYouCanDoBox
            icon={faShieldCat}
            title="features.registerAnimal.title"
            desc={"features.registerAnimal.desc"}
          >
            <WhatYouCanDoUl
              developed={[
                "name",
                "sex",
                "healthCondition",
                "dateOfBirth",
                "note",
              ]}
              developing={[
                "image",
                "file",
                "house",
                "shareConfigWithOtherUsers",
              ]}
            />
          </WhatYouCanDoBox>
          {/* ブリーディング */}
          <WhatYouCanDoBox
            icon={faCircleNodes}
            title="features.registerBreeding.title"
            desc={"features.registerBreeding.desc"}
          >
            <div className="space-y-8">
              <BreedingGrid
                miniBreeding={{
                  id: "test",
                  parents: [
                    { id: "1", name: "Father", sex: "male" },
                    { id: "2", name: "Mother", sex: "female" },
                  ],
                  children: [
                    { id: "3", name: "child1", sex: "male" },
                    { id: "4", name: "child2", sex: "female" },
                    { id: "5", name: "child3", sex: "" },
                  ],
                }}
              />
              <WhatYouCanDoUl
                developed={[
                  "parents",
                  "children",
                  "breedingStatus",
                  "startDate",
                  "endDate",
                  "note",
                ]}
                developing={["shareConfigWithOtherUsers"]}
              />
            </div>
          </WhatYouCanDoBox>
          {/* フォルダ */}
          <WhatYouCanDoBox
            icon={faFolder}
            title="features.createFolder.title"
            desc="features.createFolder.desc"
          >
            <div className="flex flex-col justify-between w-full h-full">
              <WhatYouCanDoUl
                developed={["folderName", "note"]}
                developing={["shareConfigWithOtherUsers"]}
              />
              {/* 画像 */}
              <div className="max-w-24 self-end pt-4">
                <img src={imgUrl} />
              </div>
            </div>
          </WhatYouCanDoBox>
        </div>
        <div className="text-center text-base">
          <div className="pb-3">{tLp("features.futurePlans")}</div>
          <div>
            <Link to={"/"} className={`${textLink} w-fit`}>
              {tLp("features.sendFeatureRequest")}
              <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
