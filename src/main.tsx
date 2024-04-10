import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App.tsx";
import { Account } from "./components/account/Account.tsx";
import { AnimalCreatePage } from "./components/animal/animalCreate/AnimalCreatePage.tsx";
import { AnimalPage } from "./components/animal/animalPage/AnimalPage.tsx";
import { AllAnimalsPage } from "./components/animal/animals/AllAnimalsPage.tsx";
import { AuthedPage } from "./components/authedPage/AuthedPage.tsx";
import { BreedingCreatePage } from "./components/breeding/breedingCreate/BreedingCreatePage.tsx";
import { BreedingPage } from "./components/breeding/breedingPage/BreedingPage.tsx";
import { AllBreedingsPage } from "./components/breeding/breedings/AllBreedingsPage.tsx";
import { AllAnimalsFolders } from "./components/folder/animalsFolder/AllAnimalsFolders.tsx";
import { AnimalsFolderCreate } from "./components/folder/animalsFolder/AnimalsFolderCreate.tsx";
import { AnimalsFolderPage } from "./components/folder/animalsFolder/AnimalsFolderPage.tsx";
import { AllBreedingsFolders } from "./components/folder/breedingsFolder/AllBreedingsFolders.tsx";
import { BreedingsFolderCreate } from "./components/folder/breedingsFolder/BreedingsFolderCreate.tsx";
import { BreedingsFolderPage } from "./components/folder/breedingsFolder/BreedingsFolderPage.tsx";
import { ErrPage } from "./components/generalUI/ErrPage.tsx";
import { Home } from "./components/landingPage/Home.tsx";
import { Lp } from "./components/landingPage/Lp.tsx";
import { PrivacyPolicy } from "./components/landingPage/PrivacyPolicy.tsx";
import { SignIn } from "./components/sign/SignIn.tsx";
import { SignUp } from "./components/sign/SignUp.tsx";
import "./i18n/config.ts";
import "./index.css";

const router = createBrowserRouter([
  {
    // Root route
    path: "/",
    element: <App />,
    errorElement: <ErrPage />,
    children: [
      {
        path: "",
        element: <Lp />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ],
      },
      {
        path: "sign-in",
        element: <Lp />,
        children: [
          {
            index: true,
            element: <SignIn />,
          },
        ],
      },
      {
        path: "sign-up",
        element: <Lp />,
        children: [
          {
            index: true,
            element: <SignUp />,
          },
        ],
      },
      {
        path: "privacy-policy",
        element: <Lp />,
        children: [
          {
            index: true,
            element: <PrivacyPolicy />,
          },
        ],
      },
      {
        path: "account",
        element: <AuthedPage />,
        children: [
          {
            index: true,
            element: <Account />,
          },
        ],
      },
      {
        path: "animals",
        element: <AuthedPage />,
        children: [
          {
            index: true,
            element: <AllAnimalsPage />,
          },
          {
            path: "create",
            element: <AnimalCreatePage />,
          },
          {
            path: ":animalId",
            element: <AnimalPage />,
          },
          {
            path: "folders",
            children: [
              {
                index: true,
                element: <AllAnimalsFolders />,
              },
              {
                path: "create",
                element: <AnimalsFolderCreate />,
              },
              {
                path: ":folderId",
                element: <AnimalsFolderPage />,
              },
            ],
          },
        ],
      },
      {
        path: "breedings",
        element: <AuthedPage />,
        children: [
          {
            index: true,
            element: <AllBreedingsPage />,
          },
          {
            path: "create",
            element: <BreedingCreatePage />,
          },
          {
            path: ":breedingId",
            element: <BreedingPage />,
          },
          {
            path: "folders",
            children: [
              {
                index: true,
                element: <AllBreedingsFolders />,
              },
              {
                path: "create",
                element: <BreedingsFolderCreate />,
              },
              {
                path: ":folderId",
                element: <BreedingsFolderPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
