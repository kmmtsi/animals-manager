import {
  IconDefinition,
  faFolder,
  faListUl,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

/************
 *** Path ***
 ************/
// account
export const getPathToAccount = () => "/account";
// animal
export const getPathToAnimalCreate = () => "/animals/create";
export const getPathToAnimalPage = (id: string) => `/animals/${id}`;
export const getPathToAllAnimals = () => "/animals";
export const getPathToAnimalsFolderCreate = () => "/animals/folders/create";
export const getPathToAnimalsFolderPage = (id: string) =>
  `/animals/folders/${id}`;
export const getPathToAllAnimalsFolders = () => "/animals/folders";
// authedHome
// export const getPathToAuthedHome = () => "/home";
// breeding
export const getPathToBreedingCreate = () => "/breedings/create";
export const getPathToBreedingPage = (id: string) => `/breedings/${id}`;
export const getPathToAllBreedings = () => "/breedings";
export const getPathToBreedingsFolderCreate = () => "/breedings/folders/create";
export const getPathToBreedingsFolderPage = (id: string) =>
  `/breedings/folders/${id}`;
export const getPathToAllBreedingsFolders = () => "/breedings/folders";
// home
export const getPathToHome = () => "/";
export const getPathToPolicy = () => "/privacy-policy";
// sign
export const getPathToSignIn = () => "/sign-in";
export const getPathToSignUp = () => "/sign-up";

/*****************
 *** Page Name ***
 *****************/
// account
export const getPNForAccount = () => "account";
// animal
export const getPNForAnimals = () => "animals";
export const getPNForAnimalCreate = () => "createAnimal";
// breeding
export const getPNForBreedings = () => "breedings";
export const getPNForBreedingCreate = () => "createBreeding";

/*************************
 *** Gloval navigation ***
 *************************/
export type NavItem = {
  path: string;
  name: string;
  icon: IconDefinition;
  children?: NavItem[];
};

export const navItems: NavItem[] = [
  {
    path: getPathToAllAnimals(),
    name: getPNForAnimals(),
    icon: faListUl,
    children: [
      {
        path: getPathToAllAnimalsFolders(),
        name: "folders",
        icon: faFolder,
      },
    ],
  },
  {
    path: getPathToAllBreedings(),
    name: getPNForBreedings(),
    icon: faListUl,
    children: [
      {
        path: getPathToAllBreedingsFolders(),
        name: "folders",
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
