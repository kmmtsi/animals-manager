import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App.tsx";
import { Account } from "./components/account/Account.tsx";
import { AnimalCreate } from "./components/animal/animalCreate/AnimalCreate.tsx";
import { AnimalPage } from "./components/animal/animalPage/AnimalPage.tsx";
import { AllAnimalsPage } from "./components/animal/animals/AllAnimalsPage.tsx";
import { AuthedPage } from "./components/authedPage/AuthedPage.tsx";
import { BreedingPage } from "./components/breeding/breedingPage/BreedingPage.tsx";
import { AllBreedingsPage } from "./components/breeding/breedings/AllBreedingsPage.tsx";
import { BreedingCreate } from "./components/breeding/breedingCreate/BreedingCreate.tsx";
import { AllAnimalsFolders } from "./components/folder/animalsFolder/AllAnimalsFolders.tsx";
import { AnimalsFolderPage } from "./components/folder/animalsFolder/AnimalsFolderPage.tsx";
import { AllBreedingsFolders } from "./components/folder/breedingsFolder/AllBreedingsFolders.tsx";
import { BreedingsFolderCreate } from "./components/folder/breedingsFolder/BreedingsFolderCreate.tsx";
import { BreedingsFolderPage } from "./components/folder/breedingsFolder/BreedingsFolderPage.tsx";
import { ErrPage } from "./components/generalUI/ErrPage.tsx";
import { SignIn } from "./components/sign/SignIn.tsx";
import { SignUp } from "./components/sign/SignUp.tsx";
import "./i18n/config.ts";
import "./index.css";
import { AnimalsFolderCreate } from "./components/folder/animalsFolder/AnimalsFolderCreate.tsx";

const router = createBrowserRouter([
  {
    // Root route
    path: "/",
    element: <App />,
    errorElement: <ErrPage />,
    children: [
      {
        index: true,
        element: <div>Landing Page</div>,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
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
            element: <AnimalCreate />,
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
            element: <BreedingCreate />,
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
