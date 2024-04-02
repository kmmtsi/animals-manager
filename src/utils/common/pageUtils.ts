import { faFolder, faListUl, faUser } from "@fortawesome/free-solid-svg-icons";
import i18n from "../../i18n/config";

// path
export const getPathToAccount = () => "/account";

// animal
export const getPathToAnimalCreate = () => "/animals/create";
export const getPathToAnimalPage = (id: string) => `/animals/${id}`;
export const getPathToAnimals = () => "/animals";
export const getPathToAnimalsFolderCreate = () => "/animals/folders/create";
export const getPathToAnimalsFolderPage = (id: string) =>
  `/animals/folders/${id}`;
export const getPathToAllAnimalsFolders = () => "/animals/folders";

// breeding
export const getPathToBreedingCreate = () => "/breedings/create";
export const getPathToBreedingPage = (id: string) => `/breedings/${id}`;
export const getPathToBreedings = () => "/breedings";
export const getPathToBreedingsFolderCreate = () => "/breedings/folders/create";
export const getPathToBreedingsFolderPage = (id: string) =>
  `/breedings/folders/${id}`;
export const getPathToAllBreedingsFolders = () => "/breedings/folders";

// sign
export const getPathToSignIn = () => "/sign-in";
export const getPathToSignUp = () => "/sign-up";

export const getPathToHome = () => "/";

// pageName
export const getPNForHome = () => i18n.t("home");

export const getPNForAnimals = () => i18n.t("animals");
export const getPNForAnimalCreate = () => i18n.t("createAnimal");

export const getPNForBreedings = () => i18n.t("breedings");
export const getPNForBreedingCreate = () => i18n.t("createBreeding");

export const getPNForBrFolders = () => i18n.t("breedingFolders");
export const getPNForBeedingsFolderCreate = () =>
  i18n.t("createBreedingsFolder");

export const getPNForAccount = () => i18n.t("account");

export const navItems = [
  {
    path: getPathToAnimals(),
    name: getPNForAnimals(),
    icon: faListUl,
    children: [
      {
        path: getPathToAllAnimalsFolders(),
        name: i18n.t("folders"),
        icon: faFolder,
      },
    ],
  },
  {
    path: getPathToBreedings(),
    name: getPNForBreedings(),
    icon: faListUl,
    children: [
      {
        path: getPathToAllBreedingsFolders(),
        name: i18n.t("folders"),
        icon: faFolder,
      },
    ],
  },
  {
    path: getPathToAccount(),
    name: getPNForAccount(),
    icon: faUser,
  },
];
