import { Navigate, Outlet } from "react-router-dom";

import { useUser } from "~/lib/auth";

// Redirect away from this layout if the user is authenticated
export default function PublicNotAuthLayout() {
  const user = useUser();
  if (user.isLoading) return null;
  if (user.data) return <Navigate to="/" />;
  return <Outlet />;
}
