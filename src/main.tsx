import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnimalRegisteration } from "./components/animalRegisteration/AnimalRegisteration.tsx";
import { AnimalsList } from "./components/animalsList/AnimalsList.tsx";
import { Account } from "./components/account/Account.tsx";
import { AnimalPage } from "./components/animalPage/AnimalPage.tsx";
import { ErrPage } from "./components/generalUI/ErrPage.tsx";

const router = createBrowserRouter([
  {
    // Root route
    path: "/",
    element: <App />,
    errorElement: <ErrPage />,
    children: [
      {
        // animal削除後のリダイレクト先としているので変更時注意
        index: true,
        element: <AnimalsList />,
      },
      {
        path: "create",
        element: <AnimalRegisteration />,
      },
      // {
      //   path: "import",
      //   element: <AnimalsImport />,
      // },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: ":animalId",
        element: <AnimalPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
