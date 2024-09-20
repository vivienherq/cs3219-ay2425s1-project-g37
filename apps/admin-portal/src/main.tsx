import "@peerprep/ui/tailwind/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RouterErrorPage from "~/routes/_error";
import RouterLayout from "~/routes/_layout";
import IndexPage from "~/routes/index";
import LoginPage from "~/routes/login";
import RegisterPage from "~/routes/register";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    errorElement: <RouterErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
