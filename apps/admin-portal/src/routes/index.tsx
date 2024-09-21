import { Button } from "@peerprep/ui/button";
import { getKyErrorMessage, userClient } from "@peerprep/utils/client";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { mutate } from "swr";

import { SWR_KEY_USER, useUser } from "~/lib/auth";

export default function IndexPage() {
  const user = useUser();
  if (user.isLoading) return <div>Loading...</div>;
  if (!user.data) return <Navigate to="/login" />;
  return (
    <div>
      <h1>Welcome to PeerPrep, @{user.data.username}!</h1>
      <Button
        onClick={async () => {
          try {
            await userClient.post("auth/logout");
            await mutate(SWR_KEY_USER);
            toast.success("Log out successfully. See you again!");
          } catch (e) {
            toast.error(getKyErrorMessage(e));
          }
        }}
      >
        Log out
      </Button>
    </div>
  );
}
