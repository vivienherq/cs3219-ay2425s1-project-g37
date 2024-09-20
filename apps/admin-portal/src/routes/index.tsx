import { Navigate } from "react-router-dom";

import { useUser } from "~/lib/auth";

export default function IndexPage() {
  const user = useUser();
  if (!user.isLoading && !user.data) return <Navigate to="/login" />;
  return (
    <div>
      <h1 className="text-red-500">Welcome to PeerPrep!</h1>
    </div>
  );
}
