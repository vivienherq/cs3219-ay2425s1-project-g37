// We name this file with an underscore so that we don't confuse it as the `/layout` route
import { Outlet } from "react-router-dom";

export default function RouterLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
