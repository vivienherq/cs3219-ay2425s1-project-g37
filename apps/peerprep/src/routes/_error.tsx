// We name this file with an underscore so that we don't confuse it as the `/error` route
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouterErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>404</div>;
  }

  return <div>Something went wrong</div>;
}
