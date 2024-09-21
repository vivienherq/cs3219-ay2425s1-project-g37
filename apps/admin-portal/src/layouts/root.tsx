import { Toaster } from "@peerprep/ui/toaster";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
}
