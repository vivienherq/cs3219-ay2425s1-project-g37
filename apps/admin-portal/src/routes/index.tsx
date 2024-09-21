import { Navigate } from "react-router-dom";

import { useUser } from "~/lib/auth";

export default function IndexPage() {
  const user = useUser();
  if (user.isLoading) return <div>Loading...</div>;
  if (!user.data) return <Navigate to="/login" />;
  return (
    <div>
      <h1>Welcome to PeerPrep, @{user.data.username}!</h1>
    </div>
  );
}
