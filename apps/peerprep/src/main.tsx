import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "~/index.css";
import RouterErrorPage from "~/routes/_error";
import RouterLayout from "~/routes/_layout";
import IndexPage from "~/routes/index";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    errorElement: <RouterErrorPage />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
    ],
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
