import { Navigate, Outlet } from "react-router-dom";

import { NavLogo } from "~/components/nav-logo";
import { useUser } from "~/lib/auth";

// Redirect away from this layout if the user is authenticated
export default function PublicNotAuthLayout() {
  const user = useUser();
  if (user.isLoading) return null;
  if (user.data) return <Navigate to="/" />;
  return (
    <div className="grid h-screen w-screen place-items-center">
      <nav className="container fixed inset-x-0 top-0 flex flex-row justify-between py-6">
        <NavLogo />
      </nav>
      <div className="px-6 py-12">
        <Outlet />
      </div>
    </div>
  );
}
