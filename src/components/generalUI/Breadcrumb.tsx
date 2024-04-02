import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "i18next";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  getPNForAccount,
  getPNForAnimalCreate,
  getPNForAnimals,
  getPNForBreedingCreate,
  getPNForBreedings,
  getPathToAccount,
  getPathToAllAnimalsFolders,
  getPathToAllBreedingsFolders,
  getPathToAnimalCreate,
  getPathToAnimals,
  getPathToAnimalsFolderCreate,
  getPathToBreedingCreate,
  getPathToBreedings,
  getPathToBreedingsFolderCreate,
  getPathToHome,
} from "../../utils/common/pageUtils";
import { linkUnderline } from "../../utils/css";

export const Breadcrumb = ({
  page,
  dynamic,
}: {
  page:
    | "account"
    | "animals"
    | "animalCreate"
    | "animalPage"
    | "animalsFolderCreate"
    | "animalsFolderPage"
    | "allAnimalsFolders"
    | "breedings"
    | "breedingCreate"
    | "breedingPage"
    | "breedingsFolderCreate"
    | "breedingsFolderPage"
    | "allBreedingsFolders";
  dynamic?: string;
}) => {
  const home = {
    name: <FontAwesomeIcon icon={faHouse} />,
    absPath: getPathToHome(),
  };

  const account = {
    name: getPNForAccount(),
    absPath: getPathToAccount(),
  };

  const animals = {
    name: getPNForAnimals(),
    absPath: getPathToAnimals(),
  };

  const animalCreate = {
    name: getPNForAnimalCreate(),
    absPath: getPathToAnimalCreate(),
  };

  const animalPage = {
    name: dynamic ? dynamic : "",
    absPath: "",
  };

  const breedings = {
    name: getPNForBreedings(),
    absPath: getPathToBreedings(),
  };

  const breedingCreate = {
    name: getPNForBreedingCreate(),
    absPath: getPathToBreedingCreate(),
  };

  const breedingPage = {
    name: dynamic ? dynamic : "",
    absPath: "",
  };

  const animalsFolderCreate = {
    name: t("createFolder"),
    absPath: getPathToAnimalsFolderCreate(),
  };
  const breedingsFolderCreate = {
    name: t("createFolder"),
    absPath: getPathToBreedingsFolderCreate(),
  };

  const animalsFolderPage = {
    name: dynamic ? dynamic : "",
    absPath: "",
  };
  const breedingsFolderPage = {
    name: dynamic ? dynamic : "",
    absPath: "",
  };

  const allAnimalsFolders = {
    name: t("allAnimalsFolders"),
    absPath: getPathToAllAnimalsFolders(),
  };
  const allBreedingsFolders = {
    name: t("allBreedingsFolders"),
    absPath: getPathToAllBreedingsFolders(),
  };

  let pages: { name: string | JSX.Element; absPath: string }[] = [];
  switch (page) {
    case "account":
      pages = [home, account];
      break;
    case "animals":
      pages = [home, animals];
      break;
    case "animalCreate":
      pages = [home, animals, animalCreate];
      break;
    case "animalPage":
      pages = [home, animals, animalPage];
      break;
    case "breedings":
      pages = [home, breedings];
      break;
    case "breedingCreate":
      pages = [home, breedings, breedingCreate];
      break;
    case "breedingPage":
      pages = [home, breedings, breedingPage];
      break;

    case "animalsFolderCreate":
      pages = [home, animals, allAnimalsFolders, animalsFolderCreate];
      break;
    case "breedingsFolderCreate":
      pages = [home, breedings, allBreedingsFolders, breedingsFolderCreate];
      break;

    case "animalsFolderPage":
      pages = [home, animals, allAnimalsFolders, animalsFolderPage];
      break;
    case "breedingsFolderPage":
      pages = [home, breedings, allBreedingsFolders, breedingsFolderPage];
      break;

    case "allBreedingsFolders":
      pages = [home, breedings, allBreedingsFolders];
      break;
    case "allAnimalsFolders":
      pages = [home, animals, allAnimalsFolders];
      break;
  }

  return (
    <nav className="overflow-x-auto">
      <div className="flex items-center gap-x-1 text-slate-500 text-xs text-nowrap">
        {pages.map((page, i) => {
          return (
            <Fragment key={i}>
              {i !== 0 && <span>/</span>}
              {i === pages.length - 1 ? (
                /* 最後のページはリンクを貼らない */
                <span>{page.name}</span>
              ) : (
                <Link to={page.absPath} className={linkUnderline}>
                  {page.name}
                </Link>
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
};
