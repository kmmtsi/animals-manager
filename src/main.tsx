import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AnimalRegisteration } from "./components/animalRegisteration/AnimalRegisteration.tsx";
import { AnimalsList } from "./components/animalsList/AnimalsList.tsx";
import { Account } from "./components/Account.tsx";
import { Animal } from "./components/animal/Animal.tsx";

const router = createBrowserRouter([
  {
    // Root route
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AnimalsList />
      },
      {
        path: "create",
        element: <AnimalRegisteration />
      },
      {
        path: "account",
        element: <Account />
      },
      {
        path: ":animalId",
        element: <Animal />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
