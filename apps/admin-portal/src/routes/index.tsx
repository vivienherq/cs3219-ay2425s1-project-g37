import { useUser } from "~/lib/auth";

export default function IndexPage() {
  const user = useUser();
  if (user.isLoading || !user.data) return null;
  return (
    <div>
      <h1>Welcome to PeerPrep, @{user.data.username}!</h1>
    </div>
  );
}
