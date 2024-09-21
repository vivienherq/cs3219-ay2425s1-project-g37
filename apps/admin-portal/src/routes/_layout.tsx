// We name this file with an underscore so that we don't confuse it as the `/layout` route
import { Toaster } from "@peerprep/ui/toaster";
import { Outlet } from "react-router-dom";

export default function RouterLayout() {
  return (
    <div className="">
      <Outlet />
      <Toaster />
    </div>
  );
}
