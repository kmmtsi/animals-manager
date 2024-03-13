import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrPage } from "./components/generalUI/ErrPage.tsx";
import { getPagesForRouter } from "./utils/pages/utils.tsx";

const router = createBrowserRouter([
  {
    // Root route
    path: "/",
    element: <App />,
    errorElement: <ErrPage />,
    children: getPagesForRouter(),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
